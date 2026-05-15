# Deployment Guide - GoreMade CRM Dashboard

## Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com/new)
2. Create a new repository named: `goremade-crm-dashboard`
3. Make it **Private** (to protect sensitive data)
4. Don't initialize with README (we already have one)

## Step 2: Push Code to GitHub

```bash
cd /Users/joey/.openclaw/workspace/goremade-crm-dashboard

# Add the remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/joeygore425/goremade-crm-dashboard.git

# Push to main branch
git branch -M main
git push -u origin main
```

You'll be prompted for authentication:
- Use your GitHub personal access token (PAT) as the password
- Or authenticate via SSH if you have that configured

## Step 3: Deploy to Vercel

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI if you don't have it
npm i -g vercel

# Deploy from the project directory
cd /Users/joey/.openclaw/workspace/goremade-crm-dashboard
vercel
```

Follow the prompts:
1. Link to your Vercel account
2. Confirm project name: `goremade-crm-dashboard`
3. Framework: Next.js
4. Root directory: `./`

### Option B: Connect via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Select "Import Git Repository"
4. Find and select `goremade-crm-dashboard`
5. Configure project settings (Next.js is auto-detected)
6. Add Environment Variables (see below)
7. Click "Deploy"

## Step 4: Set Environment Variables in Vercel

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

```
NEXT_PUBLIC_SUPABASE_URL = https://ulrgyupbhkmuzrcpzaov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_RdVPN_xVcquZFhuXlZmKvg_KgRBSHkX
SUPABASE_SERVICE_ROLE_KEY = sb_secret_Hy3XWLYM1eteq7dHK4IqLA_pDx2wzG8
```

Make sure these are set for both **Production** and **Preview** environments.

## Step 5: Test the Deployment

After Vercel finishes building (should take ~1-2 minutes):

1. You'll get a URL like: `https://goremade-crm-dashboard.vercel.app`
2. Click the URL and verify the dashboard loads
3. Test the database connection by navigating to different tabs
4. Verify data is loading from Supabase

## Step 6: Point Custom Domain (Optional)

To use your own domain (`crm.goremade.fit`):

1. In Vercel dashboard, go to **Settings → Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update your domain provider's DNS records
5. Wait for DNS propagation (usually 5-15 minutes)

### Alternative: Use Vercel's URL for now
- Temporary URL: `goremade-crm-dashboard.vercel.app`
- Update your team to use this while you set up DNS

## Step 7: Automatic Deployments

Every time you push to `main` branch on GitHub, Vercel will automatically:
1. Build the project
2. Run tests (if configured)
3. Deploy to production if build succeeds

You can monitor deployments at: [vercel.com/dashboard](https://vercel.com/dashboard)

## Step 8: Set Up Database (Important!)

Before using the dashboard, create the CRM tables in your Supabase database:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `sql/01-crm-tables.sql`
6. Run the query
7. Verify tables appear in **Database → Tables**

## Troubleshooting

### Build Fails
Check the Vercel deployment logs:
1. Go to your Vercel project
2. Click on the failed deployment
3. Scroll down to see build errors
4. Common issues:
   - Missing environment variables
   - Node version mismatch
   - Dependency installation errors

### Dashboard Won't Load
1. Check browser console for errors (F12)
2. Verify environment variables are set correctly
3. Check Supabase database is accessible
4. Try a hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Supabase Connection Issues
1. Verify the Supabase credentials in `.env.local`
2. Check that the database tables exist (see Step 8)
3. Make sure your Supabase project is active (not paused)
4. Check RLS policies aren't blocking access

### Data Not Loading
1. Populate the database with sample data first
2. Check that tables have actual records
3. Verify SQL queries in components match table names
4. Check browser network tab for API errors

## Local Development

For development before deploying:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server locally
npm start
```

Visit `http://localhost:3000` to see the dashboard.

## Next Steps After Deployment

1. **Populate Data**: Add trainer and client prospects to the database
2. **Create Campaigns**: Set up your first outreach campaign
3. **Monitor Metrics**: Watch the dashboard as you send emails
4. **Optimize**: Adjust your targeting based on conversion rates

## Support

For deployment issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment/vercel)
- [Supabase Documentation](https://supabase.com/docs)
