
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';

const SUPABASE_URL = "https://ohahqtkbcbtcxidvrqwr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oYWhxdGtiY2J0Y3hpZHZycXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA0MjY3OTAsImV4cCI6MjA1NjAwMjc5MH0.FSGc6JnH0MnJ_hUVFgUkvrKG4yykm759Q9wy9K1UDSw";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
