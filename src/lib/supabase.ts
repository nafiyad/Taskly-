import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// These environment variables will be set after connecting to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a mock client for development if credentials are missing
const createMockClient = () => {
  console.warn('Using mock Supabase client. Connect to Supabase for full functionality.');
  
  // Return a mock client with the same interface but no actual database operations
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: () => Promise.resolve({ error: null }),
      signInWithPassword: () => Promise.resolve({ error: null }),
      signOut: () => Promise.resolve({ error: null }),
      updateUser: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        single: () => Promise.resolve({ data: null, error: null }),
        order: () => ({
          eq: () => Promise.resolve({ data: [], error: null })
        })
      }),
      insert: () => ({
        select: () => ({
          single: () => Promise.resolve({ data: { id: 1 }, error: null })
        })
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null })
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null })
      }),
      rpc: () => Promise.resolve({ error: null })
    })
  };
};

// Check if we have valid Supabase credentials
const hasValidCredentials = supabaseUrl && supabaseAnonKey;

// Create the Supabase client or a mock client
export const supabase = hasValidCredentials 
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any;

// Export a function to check if we're using a mock client
export const isMockClient = () => !hasValidCredentials;