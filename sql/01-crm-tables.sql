-- CRM Tables for GoreMade Fitness

-- 1. TRAINER PROSPECTS
CREATE TABLE IF NOT EXISTS trainer_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  city TEXT,
  state TEXT,
  specialty TEXT, -- CrossFit, yoga, strength, etc.
  gym_or_studio TEXT,
  instagram_handle TEXT,
  linkedin_url TEXT,
  source TEXT, -- LinkedIn, Google Maps, Referral, etc.
  outreach_date TIMESTAMP,
  outreach_email_subject TEXT,
  status TEXT DEFAULT 'prospect', -- prospect, contacted, interested, call_scheduled, onboarded
  response_date TIMESTAMP,
  response_type TEXT, -- interested, not_interested, no_response
  notes TEXT,
  onboarded_date TIMESTAMP,
  referral_stage TEXT DEFAULT 'none', -- none, active, referred_trainers, referral_revenue
  referral_revenue DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CLIENT PROSPECTS
CREATE TABLE IF NOT EXISTS client_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  title TEXT, -- CEO, VP, etc.
  company TEXT,
  industry TEXT, -- finance, tech, real estate, etc.
  city TEXT,
  state TEXT,
  linkedin_url TEXT,
  contact_method TEXT, -- email, LinkedIn InMail, etc.
  outreach_date TIMESTAMP,
  status TEXT DEFAULT 'prospect', -- prospect, contacted, interested, demo_booked, first_booking, active
  response_date TIMESTAMP,
  notes TEXT,
  first_booking_date TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. OUTREACH CAMPAIGNS
CREATE TABLE IF NOT EXISTS outreach_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_name TEXT NOT NULL,
  target_type TEXT NOT NULL, -- trainers or clients
  sent_date TIMESTAMP,
  email_template_used TEXT,
  total_sent INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_replied INTEGER DEFAULT 0,
  open_rate DECIMAL(5, 2),
  click_rate DECIMAL(5, 2),
  reply_rate DECIMAL(5, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. API TOKEN TRACKER
CREATE TABLE IF NOT EXISTS api_token_tracker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL, -- supabase, resend, etc.
  endpoint TEXT,
  method TEXT, -- GET, POST, PUT, DELETE
  tokens_used INTEGER,
  cost_dollars DECIMAL(10, 4),
  response_status INTEGER,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CRM DASHBOARD STATS (for caching metrics)
CREATE TABLE IF NOT EXISTS crm_dashboard_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL UNIQUE,
  metric_value TEXT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_trainer_prospects_status ON trainer_prospects(status);
CREATE INDEX IF NOT EXISTS idx_trainer_prospects_state ON trainer_prospects(state);
CREATE INDEX IF NOT EXISTS idx_trainer_prospects_specialty ON trainer_prospects(specialty);
CREATE INDEX IF NOT EXISTS idx_trainer_prospects_created_at ON trainer_prospects(created_at);
CREATE INDEX IF NOT EXISTS idx_client_prospects_status ON client_prospects(status);
CREATE INDEX IF NOT EXISTS idx_client_prospects_industry ON client_prospects(industry);
CREATE INDEX IF NOT EXISTS idx_outreach_campaigns_target_type ON outreach_campaigns(target_type);
CREATE INDEX IF NOT EXISTS idx_api_token_tracker_service ON api_token_tracker(service_name);
CREATE INDEX IF NOT EXISTS idx_api_token_tracker_created_at ON api_token_tracker(created_at);
