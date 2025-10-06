import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase, Student } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  student: Student | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, collegeId?: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Student>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await ensureStudentProfile(session.user);
        await loadStudentProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await ensureStudentProfile(session.user);
          await loadStudentProfile(session.user.id);
        } else {
          setStudent(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadStudentProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setStudent(data);
    } catch (error) {
      console.error('Error loading student profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const ensureStudentProfile = async (u: User) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', u.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        // Create a minimal profile if not exists
        const fullNameFromMeta = (u.user_metadata as any)?.full_name as string | undefined;
        const collegeIdFromMeta = (u.user_metadata as any)?.college_id as string | undefined;
        const { error: insertError } = await supabase
          .from('students')
          .insert({
            user_id: u.id,
            email: u.email,
            full_name: fullNameFromMeta || (u.email ?? 'New User'),
            college_id: collegeIdFromMeta || null,
          });
        if (insertError) throw insertError;
      }
    } catch (e) {
      console.error('Error ensuring student profile:', e);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, collegeId?: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            college_id: collegeId || null,
          },
        },
      });

      if (authError) return { error: authError };
      if (!authData.user) return { error: new Error('User creation failed') as AuthError };

      // If we have a session (email confirmation disabled), ensure profile now
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session?.user) {
        await ensureStudentProfile(sessionData.session.user);
        await loadStudentProfile(sessionData.session.user.id);
        return { error: null };
      }

      // No session yet (likely email confirmation required). Let the user know.
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setStudent(null);
  };

  const updateProfile = async (data: Partial<Student>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      const { error } = await supabase
        .from('students')
        .update(data)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadStudentProfile(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const value = {
    user,
    student,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
