# GoreMade CRM Dashboard - Setup Checklist

Complete checklist for getting the CRM dashboard up and running.

## ✅ Phase 1: Database Setup (15 minutes)

- [ ] Go to [Supabase Dashboard](https://app.supabase.com)
- [ ] Select your GoreMade project
- [ ] Click **SQL Editor** in left sidebar
- [ ] Click **New Query**
- [ ] Copy/paste contents of `sql/01-crm-tables.sql`
- [ ] Review the SQL tables being created:
  - [ ] `trainer_prospects` - trainer acquisition pipeline
  - [ ] `client_prospects` - client acquisition pipeline
  - [ ] `outreach_campaigns` - email campaign tracking
  - [ ] `api_token_tracker` - API usage monitoring
- [ ] Click **Run** to execute the migration
- [ ] Verify tables appear in **Database → Tables** (refresh page)
- [ ] ✅ Database setup complete

## ✅ Phase 2: GitHub Repository (10 minutes)

- [ ] Go to [GitHub](https://github.com/new)
- [ ] Create new private repository: `goremade-crm-dashboard`
- [ ] Do NOT initialize with README (we have one)
- [ ] Copy the repository URL
- [ ] Open terminal and run:
  ```bash
  cd /Users/joey/.openclaw/workspace/goremade-crm-dashboard
  git remote add origin YOUR_REPO_URL
  git branch -M main
  git push -u origin main
  ```
- [ ] Enter GitHub credentials when prompted
- [ ] Verify code appears on GitHub
- [ ] ✅ GitHub repository complete

## ✅ Phase 3: Vercel Deployment (15 minutes)

### Option A: Via Vercel CLI (Recommended)

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] From project directory: `vercel`
- [ ] Select your team
- [ ] Confirm project name: `goremade-crm-dashboard`
- [ ] Confirm root directory: `./`
- [ ] Skip build settings (Next.js is auto-detected)

### Option B: Via Vercel Dashboard

- [ ] Go to [Vercel Dashboard](https://vercel.com)
- [ ] Click **Add New → Project**
- [ ] Select **Import Git Repository**
- [ ] Find `goremade-crm-dashboard`
- [ ] Click **Import**
- [ ] Confirm project settings
- [ ] Skip environment variables for now (add in next step)

### Set Environment Variables

- [ ] In Vercel project, go to **Settings → Environment Variables**
- [ ] Add these 3 variables (set for Production & Preview):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL` = `https://ulrgyupbhkmuzrcpzaov.supabase.co`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `sb_publishable_RdVPN_xVcquZFhuXlZmKvg_KgRBSHkX`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` = `sb_secret_Hy3XWLYM1eteq7dHK4IqLA_pDx2wzG8`
- [ ] Click **Deploy** to trigger initial build
- [ ] Wait for deployment to complete (2-3 minutes)
- [ ] Click the Vercel URL when ready
- [ ] ✅ Vercel deployment complete

## ✅ Phase 4: Test Dashboard (10 minutes)

- [ ] Open your Vercel URL
- [ ] Verify you see the GoreMade CRM header
- [ ] Check all tabs load without errors:
  - [ ] 📊 Overview tab
  - [ ] 👨‍🏫 Trainer Pipeline tab
  - [ ] 👥 Client Pipeline tab
  - [ ] 📧 Campaigns tab
  - [ ] 🔑 Token Usage tab
- [ ] Open browser DevTools (F12) to check for errors
- [ ] Verify no red error messages in console
- [ ] ✅ Dashboard loads successfully

## ✅ Phase 5: Populate Sample Data (10 minutes)

- [ ] Go to Supabase SQL Editor
- [ ] Create new query
- [ ] Copy/paste SQL from `DATA_SETUP.md`
- [ ] Run the query
- [ ] Return to dashboard and refresh (Cmd+R)
- [ ] Verify data appears:
  - [ ] Overview shows trainer count
  - [ ] Trainer Pipeline tab shows 8 trainers
  - [ ] Client Pipeline tab shows 6 clients
  - [ ] Campaigns tab shows 3 campaigns
  - [ ] Token Tracker shows 4 API calls
- [ ] ✅ Sample data loaded

## ✅ Phase 6: Connect Custom Domain (Optional - Can do later)

- [ ] Decide on domain:
  - [ ] Use `crm.goremade.fit` (requires DNS setup)
  - [ ] Use `crm-goremade.vercel.app` (temporary, free)
- [ ] If using custom domain:
  - [ ] In Vercel, go to **Settings → Domains**
  - [ ] Add your domain
  - [ ] Follow DNS configuration steps
  - [ ] Update DNS provider with Vercel records
  - [ ] Wait for DNS propagation (~15 minutes)
- [ ] ✅ Domain configured (or using Vercel URL)

## ✅ Phase 7: Verify All Features Work (5 minutes)

### Dashboard Overview
- [ ] Key metrics display correctly
- [ ] Trainer/Client funnels show data
- [ ] Conversion rates calculate correctly

### Trainer Pipeline
- [ ] Table shows 8 trainers
- [ ] Status filter works
- [ ] State filter works
- [ ] Specialty filter works
- [ ] Search works

### Client Pipeline
- [ ] Table shows 6 clients
- [ ] Status filter works
- [ ] Industry filter works
- [ ] Search works

### Campaigns
- [ ] Shows 3 campaigns
- [ ] Metrics display (open rate, click rate, etc.)
- [ ] Campaign names are visible

### Token Tracker
- [ ] Shows 4 API calls
- [ ] Cost calculations are visible
- [ ] Service breakdown shows data

## ✅ Phase 8: Document Your Setup

- [ ] Create a file `DEPLOYMENT_NOTES.md` with:
  - [ ] Your Vercel URL
  - [ ] Your custom domain (if applicable)
  - [ ] Deployment date
  - [ ] Any issues encountered and how you fixed them
- [ ] Update your team with dashboard URL
- [ ] Add link to dashboard in your team docs

## 🚀 Ready to Start Using!

Once all phases are complete:

1. **Add Real Data**: Import your actual trainer and client lists
2. **Create Campaigns**: Set up your first email outreach campaign
3. **Monitor Results**: Track open rates, responses, and conversions
4. **Optimize**: Adjust your targeting based on what's working

## Troubleshooting

### Dashboard Won't Load
- [ ] Check Vercel deployment status in dashboard
- [ ] Verify environment variables are set
- [ ] Clear browser cache (Cmd+Shift+Delete)
- [ ] Check browser console for errors

### Database Won't Connect
- [ ] Verify Supabase credentials in `.env.local`
- [ ] Check database tables exist in Supabase
- [ ] Verify RLS policies allow read access
- [ ] Try in Incognito mode to rule out caching

### Search/Filters Don't Work
- [ ] Verify sample data was inserted correctly
- [ ] Check that records have required fields
- [ ] Try refreshing the page

### Deployment Failed
- [ ] Check Vercel logs for build errors
- [ ] Verify all dependencies installed: `npm install`
- [ ] Check that `package.json` is in root directory
- [ ] Try rebuilding: go to Vercel → Deployments → Redeploy

## Support Resources

- **Vercel Issues**: https://vercel.com/docs
- **Supabase Issues**: https://supabase.com/docs
- **Next.js Issues**: https://nextjs.org/docs
- **GitHub Issues**: https://github.com/joeygore425/goremade-crm-dashboard/issues

## Next Steps After Setup

1. **Research Trainers**: Find 50-100 trainers to target
2. **Create Prospect List**: Add them to `trainer_prospects` table
3. **Draft Email Template**: Create your outreach email
4. **Send Campaign**: Use Resend to send outreach emails
5. **Track Metrics**: Monitor open rates and responses in dashboard
6. **Follow Up**: Send follow-ups to interested prospects
7. **Iterate**: Optimize based on what's working

## Timeline

- **Today**: Complete phases 1-5 (1 hour total)
- **Tomorrow**: Complete phases 6-7 (30 minutes)
- **This Week**: Start adding real data and running campaigns

You're building an automated pipeline. Each week you'll add more trainers, more clients, and more campaigns. The dashboard will help you see what's working and scale what works.

Good luck! 🚀
