import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isMockClient } from '../lib/supabase';
import toast from 'react-hot-toast';
import { UserSubscription } from '../types';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  subscription: UserSubscription;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateSubscription: (plan: 'free' | 'pro') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<UserSubscription>({
    plan: 'free',
    status: 'active'
  });

  useEffect(() => {
    // If using mock client, create a mock user
    if (isMockClient()) {
      const mockUser = {
        id: 'mock-user-id',
        email: 'demo@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString()
      } as User;
      
      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;
      
      setSession(mockSession);
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserSubscription(session.user.id);
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserSubscription(session.user.id);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserSubscription = async (userId: string) => {
    try {
      // First check if the user has a subscription
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching subscription:', error);
        return;
      }
      
      // If user has a subscription record
      if (data && data.length > 0) {
        setSubscription({
          plan: data[0].plan,
          status: data[0].status,
          currentPeriodEnd: data[0].current_period_end,
          cancelAtPeriodEnd: data[0].cancel_at_period_end
        });
      } else {
        // Create a default subscription for new users
        const { error: insertError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: userId,
            plan: 'free',
            status: 'active'
          });
        
        if (insertError) {
          console.error('Error creating subscription:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in subscription fetch:', error);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isMockClient()) {
        // Simulate signup success
        toast.success('Account created! In demo mode, please use the sign in option.');
        return;
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Account created! Please check your email for confirmation.');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      if (isMockClient()) {
        // Create a mock user and session
        const mockUser = {
          id: 'mock-user-id',
          email: email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: new Date().toISOString()
        } as User;
        
        const mockSession = {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: mockUser
        } as Session;
        
        setSession(mockSession);
        setUser(mockUser);
        setSubscription({
          plan: 'free',
          status: 'active'
        });
        toast.success('Signed in successfully (Demo Mode)!');
        return;
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast.success('Signed in successfully!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      if (isMockClient()) {
        // Clear mock user and session
        setSession(null);
        setUser(null);
        toast.success('Signed out successfully (Demo Mode)!');
        return;
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully!');
    } catch (error: any) {
      toast.error(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateSubscription = async (plan: 'free' | 'pro') => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      if (isMockClient()) {
        setSubscription({
          ...subscription,
          plan
        });
        toast.success(`Subscription updated to ${plan} plan!`);
        return;
      }
      
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          plan,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setSubscription({
        ...subscription,
        plan
      });
      
      toast.success(`Subscription updated to ${plan} plan!`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update subscription');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      subscription,
      signUp, 
      signIn, 
      signOut,
      updateSubscription
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}