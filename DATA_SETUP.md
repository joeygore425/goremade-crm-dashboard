# Data Setup Guide - GoreMade CRM

This guide shows you how to populate the CRM dashboard with trainer and client data.

## Method 1: Supabase SQL Editor (Quickest)

### Add Sample Data

1. Go to [Supabase Dashboard](https://app.supabase.com) → Your Project → SQL Editor
2. Create a new query and copy-paste the SQL below
3. Run the query

```sql
-- Sample Trainer Prospects
INSERT INTO trainer_prospects (
  name, email, phone, city, state, specialty, gym_or_studio, 
  instagram_handle, source, status, notes, created_at
) VALUES
('Alex Smith', 'alex@example.com', '555-0101', 'Austin', 'TX', 'CrossFit', 'CrossFit Austin', '@alexsmith', 'LinkedIn', 'interested', 'Strong engagement, waiting on call', NOW()),
('Jamie Lee', 'jamie@example.com', '555-0102', 'Dallas', 'TX', 'Strength Training', 'BodyForce Gym', '@jamielee', 'Google Maps', 'contacted', 'Sent initial outreach yesterday', NOW()),
('Chris Jones', 'chris@example.com', '555-0103', 'Houston', 'TX', 'HIIT', 'Fitness Plus', '@chrisjones', 'LinkedIn', 'prospect', 'New lead from bulk import', NOW()),
('Taylor Brown', 'taylor@example.com', '555-0104', 'San Antonio', 'TX', 'Yoga', 'Flow Yoga Studio', '@taylorbrown', 'Referral', 'onboarded', 'Onboarded successfully', NOW()),
('Morgan Davis', 'morgan@example.com', '555-0105', 'Austin', 'TX', 'Personal Training', 'Elite Training', '@morgandavis', 'LinkedIn', 'interested', 'Interested in referral program', NOW()),
('Casey Wilson', 'casey@example.com', '555-0106', 'Los Angeles', 'CA', 'Strength Training', 'Gold Gym LA', '@caseywilson', 'Google Maps', 'contacted', 'Waiting for response', NOW()),
('Jordan Miller', 'jordan@example.com', '555-0107', 'San Francisco', 'CA', 'CrossFit', 'CrossFit SF', '@jordanmiller', 'LinkedIn', 'interested', 'High interest, scheduling call', NOW()),
('Riley Anderson', 'riley@example.com', '555-0108', 'New York', 'NY', 'HIIT', 'NYC Fitness', '@rileyanderson', 'LinkedIn', 'prospect', 'Just contacted', NOW());

-- Sample Client Prospects
INSERT INTO client_prospects (
  name, email, title, company, industry, city, state, 
  contact_method, status, notes, created_at
) VALUES
('John Executive', 'john@tech-startup.com', 'CEO', 'TechStartup Inc', 'Technology', 'Austin', 'TX', 'LinkedIn InMail', 'interested', 'Very interested in premium fitness', NOW()),
('Sarah Finance', 'sarah@financebank.com', 'VP of Operations', 'FinanceBank Co', 'Finance', 'New York', 'NY', 'Email', 'contacted', 'Sent intro email, waiting response', NOW()),
('Michael Real Estate', 'michael@realestate.com', 'Owner', 'Real Estate Partners', 'Real Estate', 'Los Angeles', 'CA', 'LinkedIn InMail', 'prospect', 'High net worth prospect', NOW()),
('Jennifer Tech', 'jennifer@techcorp.com', 'Director', 'TechCorp Global', 'Technology', 'San Francisco', 'CA', 'Email', 'demo_booked', 'Demo scheduled for Friday', NOW()),
('David PE', 'david@privateequity.com', 'Managing Partner', 'PE Capital', 'Finance', 'New York', 'NY', 'LinkedIn', 'first_booking', 'First booking confirmed', NOW()),
('Amanda Startup', 'amanda@startup.io', 'Founder', 'Startup Ventures', 'Technology', 'Austin', 'TX', 'Email', 'active', 'Active user, 5 bookings', NOW());

-- Sample Outreach Campaign
INSERT INTO outreach_campaigns (
  campaign_name, target_type, sent_date, email_template_used, 
  total_sent, total_opened, total_clicked, total_replied,
  open_rate, click_rate, reply_rate, notes, created_at
) VALUES
('Texas Trainers Batch 1', 'trainers', NOW() - INTERVAL '7 days', 'Version 2 - Value Focus', 
 50, 18, 8, 4, 36, 16, 8, 'Strong open rate, good engagement', NOW()),
('California Trainers Batch 1', 'trainers', NOW() - INTERVAL '5 days', 'Version 3 - Referral Focus',
 45, 14, 5, 2, 31, 11, 4, 'Moderate performance', NOW()),
('Executive Prospects Round 1', 'clients', NOW() - INTERVAL '3 days', 'VIP Access Offer',
 30, 12, 6, 3, 40, 20, 10, 'Excellent open rate with execs', NOW());

-- Sample API Token Tracking
INSERT INTO api_token_tracker (
  service_name, endpoint, method, tokens_used, cost_dollars, 
  response_status, created_at
) VALUES
('supabase', '/rest/v1/trainer_prospects', 'GET', 100, 0.002, 200, NOW() - INTERVAL '1 day'),
('supabase', '/rest/v1/trainer_prospects', 'POST', 150, 0.003, 201, NOW() - INTERVAL '1 day'),
('resend', '/emails', 'POST', 500, 0.0025, 200, NOW() - INTERVAL '2 days'),
('resend', '/emails', 'POST', 450, 0.00225, 200, NOW() - INTERVAL '3 days');
```

### Verify Data Loaded

1. Go to **Supabase Dashboard → Database → Tables**
2. Click on each table to see the data:
   - `trainer_prospects` (8 trainers)
   - `client_prospects` (6 clients)
   - `outreach_campaigns` (3 campaigns)
   - `api_token_tracker` (4 entries)

## Method 2: Import CSV Files

If you have a CSV of trainers or clients:

1. Go to **Supabase Dashboard → Database → Tables**
2. Select the table (e.g., `trainer_prospects`)
3. Click **Insert** → **Import CSV**
4. Select your CSV file
5. Map columns to database fields
6. Click **Import**

### CSV Format Example

**trainers.csv:**
```
name,email,phone,city,state,specialty,gym_or_studio,instagram_handle,source
Alex Smith,alex@example.com,555-0101,Austin,TX,CrossFit,CrossFit Austin,@alexsmith,LinkedIn
Jamie Lee,jamie@example.com,555-0102,Dallas,TX,Strength Training,BodyForce Gym,@jamielee,Google Maps
```

## Method 3: Direct API Calls

Use your Supabase API to insert data programmatically:

```javascript
// Node.js/JavaScript example
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  'https://ulrgyupbhkmuzrcpzaov.supabase.co',
  'YOUR_SERVICE_ROLE_KEY'
)

const { data, error } = await supabase
  .from('trainer_prospects')
  .insert([
    {
      name: 'New Trainer',
      email: 'newtrainer@example.com',
      state: 'TX',
      specialty: 'CrossFit',
      status: 'prospect'
    }
  ])

if (error) console.error('Error:', error)
else console.log('Inserted:', data)
```

## Method 4: Use the Dashboard UI (When Built)

Future versions of the dashboard will include:
- Form to add new prospects
- Bulk import interface
- CSV download/export
- Campaign creation wizard

## Understanding the Data

### Trainer Statuses
- **prospect**: New lead, not yet contacted
- **contacted**: Email sent, awaiting response
- **interested**: Responded positively
- **call_scheduled**: Meeting booked
- **onboarded**: Successfully joined as trainer

### Client Statuses
- **prospect**: New lead, not yet contacted
- **contacted**: Email sent, awaiting response
- **interested**: Expressed interest
- **demo_booked**: Demo/call scheduled
- **first_booking**: Made their first booking
- **active**: Paying customer

### Campaign Metrics
- **Open Rate**: % of emails opened
- **Click Rate**: % of links clicked
- **Reply Rate**: % who responded

Typical benchmarks:
- Email open rate: 25-40%
- Click rate: 5-15%
- Reply rate: 2-8%

## Updating Data

To update prospects as they progress:

```sql
-- Mark trainer as interested
UPDATE trainer_prospects 
SET status = 'interested', 
    response_date = NOW()
WHERE email = 'alex@example.com';

-- Update client to active
UPDATE client_prospects 
SET status = 'active'
WHERE email = 'john@tech-startup.com';

-- Update campaign metrics
UPDATE outreach_campaigns 
SET total_opened = 20,
    total_clicked = 9,
    open_rate = 40
WHERE campaign_name = 'Texas Trainers Batch 1';
```

## Archiving Old Data

To move prospects that aren't converting:

```sql
-- Archive old prospects (not contacted in 60+ days)
UPDATE trainer_prospects 
SET notes = 'ARCHIVED: No response for 60+ days'
WHERE outreach_date < NOW() - INTERVAL '60 days'
  AND status = 'contacted'
  AND response_type = 'no_response';
```

## Tips for Data Quality

✅ **Do:**
- Keep email addresses unique
- Use consistent state abbreviations (TX, CA, NY, etc.)
- Document specialty/industry values
- Track outreach dates for follow-ups
- Update status as prospects progress

❌ **Don't:**
- Leave duplicate emails
- Use inconsistent location formats
- Have vague notes
- Forget to track when you contacted someone
- Leave status as "prospect" if already contacted

## Exporting Data

To download your data as CSV:

1. Go to **Supabase Dashboard → Tables**
2. Select table and click **Export**
3. Choose format: JSON or CSV
4. Download file

## Syncing with External Tools

If you use other CRM tools or tracking systems:

1. **Google Sheets**: Use Zapier to sync to Google Sheets
2. **HubSpot**: Build a Zapier integration
3. **Pipedrive**: Use their API to sync data
4. **Custom Scripts**: Use Supabase API to pull data

## Sample Data vs Real Data

The sample data in this guide is for testing. When you're ready:

1. **Clean up sample data** (delete test records)
2. **Import real trainer list** from LinkedIn research
3. **Add real client prospects** from your network
4. **Create first real campaign** to test

Then monitor metrics and optimize from there.

## Next Steps

1. ✅ Create the CRM tables (from DEPLOYMENT.md)
2. ✅ Add sample data (this file)
3. ✅ Deploy dashboard to Vercel
4. ✅ View data in your dashboard
5. 🚀 Start adding real prospects
6. 🚀 Run your first email campaign
7. 🚀 Track results and iterate

Good luck! 🎯
