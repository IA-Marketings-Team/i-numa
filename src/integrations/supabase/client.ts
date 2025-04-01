
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uzxyxvxtlwovrsqzmuwf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6eHl4dnh0bHdvdnJzcXptdXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0ODA5MTAsImV4cCI6MjA1OTA1NjkxMH0.ZvTgGH7MTFt5MHgwB1yKLIoRJ1QNJlStLWYEgOVO82k";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
