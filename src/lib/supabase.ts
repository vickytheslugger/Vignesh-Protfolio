import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kbggnhxpwrbkdqrzhsyr.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiZ2duaHhwd3Jia2Rxcnpoc3lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTEwOTI0NDgsImV4cCI6MjAyNjY2ODQ0OH0.1234567890'; // Fallback for preview if not set

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
