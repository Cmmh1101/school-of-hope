// Public Supabase project config. The anon key below is meant to be public — it's safe to
// ship in client-side code. Row Level Security policies (see supabase/schema.sql) are what
// actually control who can read or write data, not secrecy of this key.
var SUPABASE_URL = "https://pftgmhzdfegsckvuasox.supabase.co";
var SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmdGdtaHpkZmVnc2NrdnVhc294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwMzMxMDAsImV4cCI6MjEwNTYwOTEwMH0.QKK55i1gBX9AdJGRPqec2GckHmxZCg_0Leg_cDBZSPg";

var sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
