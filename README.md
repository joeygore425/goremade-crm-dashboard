# GoreMade CRM Dashboard

A comprehensive customer relationship management (CRM) dashboard for GoreMade Fitness, tracking trainer acquisition, client pipelines, email campaigns, and API token usage.

## 🎯 Features

### 📊 Dashboard Overview
- Real-time key metrics (trainers onboarded, active clients, revenue)
- Trainer and client acquisition funnels
- Conversion rate tracking
- API usage and cost monitoring

### 👨‍🏫 Trainer Pipeline
- Track trainer prospects through acquisition funnel
- Filter by status, state, and specialty
- Monitor outreach dates and response rates
- Status tracking: prospect → contacted → interested → onboarded

### 👥 Client Pipeline
- Manage high-end client prospects
- Track client status through booking funnel
- Filter by industry and status
- Monitor first booking conversions

### 📧 Outreach Performance
- Monitor email campaign metrics
- Track open rates, click rates, reply rates
- Campaign-level analytics
- Performance benchmarking

### 🔑 Token Tracker
- Monitor API usage across services (Supabase, Resend)
- Real-time cost tracking
- Usage breakdown by service
- Monthly and annual projections

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account with database setup

### Installation

```bash
cd goremade-crm-dashboard
npm install
```

### Environment Setup

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Database Setup

Run the SQL migrations to create the CRM tables:

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Create a new query and paste the contents of `sql/01-crm-tables.sql`
4. Run the migration

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

### Production Build

```bash
npm run build
npm start
```

## 📊 Database Schema

### Tables

#### `trainer_prospects`
Tracks trainer acquisition pipeline

**Columns:**
- `id` - UUID primary key
- `name`, `email`, `phone` - Contact info
- `state`, `specialty`, `gym_or_studio` - Business info
- `status` - prospect | contacted | interested | call_scheduled | onboarded
- `outreach_date`, `response_date` - Timing
- `onboarded_date` - When they joined
- `referral_stage`, `referral_revenue` - Referral tracking
- `created_at`, `updated_at` - Timestamps

#### `client_prospects`
Tracks executive/client acquisition

**Columns:**
- `id` - UUID primary key
- `name`, `email`, `title`, `company` - Contact and job info
- `industry`, `city`, `state` - Firmographic data
- `status` - prospect | contacted | interested | demo_booked | first_booking | active
- `outreach_date`, `response_date` - Timing
- `first_booking_date` - First purchase
- `created_at`, `updated_at` - Timestamps

#### `outreach_campaigns`
Tracks email campaign performance

**Columns:**
- `campaign_name` - Campaign identifier
- `target_type` - trainers | clients
- `total_sent`, `total_opened`, `total_clicked`, `total_replied` - Metrics
- `open_rate`, `click_rate`, `reply_rate` - Calculated percentages
- `email_template_used` - Which template
- `sent_date` - When campaign launched
- `created_at`, `updated_at` - Timestamps

#### `api_token_tracker`
Monitors API usage and costs

**Columns:**
- `service_name` - supabase | resend | etc
- `endpoint`, `method` - Request details
- `tokens_used`, `cost_dollars` - Usage metrics
- `response_status`, `error_message` - Response info
- `created_at` - Timestamp

## 🎨 UI Design

- **Dark Theme**: Premium, professional aesthetic
- **Responsive**: Works on desktop and tablet
- **Real-time Data**: Auto-syncs from Supabase
- **Charts**: Funnel visualization for conversion tracking
- **Filters**: Advanced search and filtering by multiple criteria

## 📱 Component Structure

```
app/
├── layout.tsx          # Root layout
├── page.tsx            # Homepage
├── globals.css         # Global styles
└── dashboard/          # Dashboard pages

components/
├── Dashboard.tsx       # Main dashboard wrapper
├── DashboardOverview.tsx
├── TrainerPipeline.tsx
├── ClientPipeline.tsx
├── OutreachPerformance.tsx
├── TokenTracker.tsx
├── Header.tsx
├── StatCard.tsx
├── FunnelChart.tsx
└── SearchFilter.tsx

lib/
├── supabase.ts         # Supabase client & types
└── utils.ts            # Utility functions
```

## 🔄 Data Flow

1. **Trainer Outreach** → Create `trainer_prospects` entries
2. **Send Campaign** → Create `outreach_campaigns` entry with Resend
3. **Track Responses** → Update prospect status as responses come in
4. **Monitor Metrics** → Dashboard auto-fetches and displays metrics
5. **Track Costs** → Log API calls to `api_token_tracker`

## 📈 Key Metrics

- **Trainer Conversion Rate**: prospects → onboarded
- **Client Activation Rate**: prospects → active users
- **Email Performance**: open rate, click rate, reply rate
- **API Costs**: monthly projections and usage by service
- **Pipeline Health**: prospects at each stage of funnel

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Recharts
- **Icons**: Lucide React

## 📋 Deployment

### Deploy to Vercel

```bash
vercel deploy
```

### Environment Variables (Vercel)
Add the following to your Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📞 Support

For issues or questions, refer to:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 📄 License

MIT
