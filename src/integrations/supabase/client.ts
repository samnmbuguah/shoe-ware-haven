// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://mnkimdgmttmqemgaupxn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ua2ltZGdtdHRtcWVtZ2F1cHhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MTM4MDEsImV4cCI6MjA0NjQ4OTgwMX0.IPuoC8D2mIBqCK3h1TPYmenHEZfFR6DVqCeob2Mb7Gk";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);