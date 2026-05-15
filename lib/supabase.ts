import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase instance (with service role)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Types for database
export interface TrainerProspect {
  id: string
  name: string
  email: string
  phone?: string
  city?: string
  state?: string
  specialty?: string
  gym_or_studio?: string
  instagram_handle?: string
  linkedin_url?: string
  source?: string
  outreach_date?: string
  outreach_email_subject?: string
  status: string
  response_date?: string
  response_type?: string
  notes?: string
  onboarded_date?: string
  referral_stage?: string
  referral_revenue?: number
  created_at: string
  updated_at: string
}

export interface ClientProspect {
  id: string
  name: string
  email: string
  title?: string
  company?: string
  industry?: string
  city?: string
  state?: string
  linkedin_url?: string
  contact_method?: string
  outreach_date?: string
  status: string
  response_date?: string
  notes?: string
  first_booking_date?: string
  created_at: string
  updated_at: string
}

export interface OutreachCampaign {
  id: string
  campaign_name: string
  target_type: string
  sent_date?: string
  email_template_used?: string
  total_sent: number
  total_opened: number
  total_clicked: number
  total_replied: number
  open_rate?: number
  click_rate?: number
  reply_rate?: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface ApiTokenTracker {
  id: string
  service_name: string
  endpoint?: string
  method?: string
  tokens_used: number
  cost_dollars: number
  response_status?: number
  error_message?: string
  created_at: string
}
