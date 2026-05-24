-- Batch Tracking Tables for Automated Campaign System

-- CAMPAIGN BATCHES (track each batch execution)
CREATE TABLE IF NOT EXISTS campaign_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number INTEGER NOT NULL,
  batch_type TEXT NOT NULL, -- 'trainer' or 'client'
  status TEXT DEFAULT 'running', -- running, completed, failed
  scheduled_time TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  prospects_found INTEGER DEFAULT 0,
  emails_sent INTEGER DEFAULT 0,
  delivery_rate DECIMAL(5, 2) DEFAULT 0,
  success_rate DECIMAL(5, 2) DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BATCH PROSPECTS (link prospects to their batch)
CREATE TABLE IF NOT EXISTS batch_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES campaign_batches(id) ON DELETE CASCADE,
  prospect_type TEXT NOT NULL, -- 'trainer' or 'client'
  prospect_id UUID,
  prospect_name TEXT,
  prospect_email TEXT,
  prospect_title TEXT,
  prospect_city TEXT,
  prospect_company TEXT,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BATCH SENDS (track each email sent in a batch)
CREATE TABLE IF NOT EXISTS batch_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID REFERENCES campaign_batches(id) ON DELETE CASCADE,
  prospect_email TEXT,
  subject_line TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivery_status TEXT DEFAULT 'pending', -- pending, delivered, bounced, failed
  resend_id TEXT,
  http_status INTEGER,
  error_message TEXT,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_campaign_batches_batch_number ON campaign_batches(batch_number);
CREATE INDEX IF NOT EXISTS idx_campaign_batches_batch_type ON campaign_batches(batch_type);
CREATE INDEX IF NOT EXISTS idx_campaign_batches_status ON campaign_batches(status);
CREATE INDEX IF NOT EXISTS idx_campaign_batches_created_at ON campaign_batches(created_at);
CREATE INDEX IF NOT EXISTS idx_batch_prospects_batch_id ON batch_prospects(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_prospects_prospect_type ON batch_prospects(prospect_type);
CREATE INDEX IF NOT EXISTS idx_batch_sends_batch_id ON batch_sends(batch_id);
CREATE INDEX IF NOT EXISTS idx_batch_sends_delivery_status ON batch_sends(delivery_status);
