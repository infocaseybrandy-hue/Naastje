import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Supabase env:', { 
  url: supabaseUrl ? 'set' : 'undefined', 
  key: supabaseAnonKey ? 'set' : 'undefined'
})

export const supabase = createClient(
  supabaseUrl || 'https://piphhhlpyyoqieldjkxr.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpcGhoaGxweXlvcWllbGRqa3hyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDAwMjgsImV4cCI6MjA5MTQ3NjAyOH0.BotdxBZS2vZ5e-lI5-9VcNrbf4Jd900I1g83GcXdlsE'
)