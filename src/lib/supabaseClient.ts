/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js'

// Read from environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration missing:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey,
    currentEnv: import.meta.env.MODE
  });
  throw new Error('Missing Supabase environment variables. Please check your .env.local file and Vercel environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
