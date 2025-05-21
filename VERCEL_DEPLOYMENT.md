# Multilingual Navigation Site Deployment Guide

This document provides instructions for deploying the Multilingual Navigation Site to Vercel with Supabase and Cloudflare R2 integration.

## Prerequisites

Before deploying, you'll need:

1. A [Vercel](https://vercel.com) account
2. A [Supabase](https://supabase.com) project
3. A [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket
4. Git installed on your local machine

## Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/multilingual-nav.git
cd multilingual-nav
```

## Step 2: Set Up Supabase

1. Create a new Supabase project from the [Supabase Dashboard](https://app.supabase.com)
2. Go to Project Settings > API to find your project URL and API keys
3. Run the database migrations:
   - Copy the SQL from `migrations/schema.sql`
   - Paste it into the SQL Editor in your Supabase dashboard and run it

## Step 3: Set Up Cloudflare R2

1. Create an R2 bucket in your Cloudflare dashboard
2. Create API tokens with read/write access to your bucket
3. Set up a public access URL for your bucket using Cloudflare Workers or R2 public access

## Step 4: Configure Environment Variables

Create a `.env.local` file based on the `.env.local.example` template:

```bash
cp .env.local.example .env.local
```

Fill in the values:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=multilingual-nav
NEXT_PUBLIC_R2_PUBLIC_URL=https://your-public-bucket-url.com

# Authentication
JWT_SECRET=your-secure-random-string

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-production-url.com
```

## Step 5: Deploy to Vercel

### Option 1: Deploy from the Vercel Dashboard

1. Import your GitHub repository in the Vercel dashboard
2. Configure the project:
   - Framework Preset: Next.js
   - Build Command: `pnpm build`
   - Output Directory: `.next`
3. Add all environment variables from your `.env.local` file
4. Deploy

### Option 2: Deploy using Vercel CLI

1. Install the Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

## Step 6: Post-Deployment Configuration

1. Update the `NEXT_PUBLIC_SITE_URL` environment variable in Vercel to match your deployed URL
2. Configure authentication redirect URLs in your Supabase project settings

## Troubleshooting

### Database Connection Issues

- Ensure your Supabase project is on the correct plan for your needs
- Check that your IP is not restricted in Supabase settings

### R2 Storage Issues

- Verify CORS settings for your R2 bucket
- Ensure your R2 tokens have the correct permissions

### Deployment Failures

- Check Vercel build logs for specific errors
- Ensure all environment variables are correctly set

## Updating Your Deployment

To update your deployment after making changes:

1. Push changes to your GitHub repository (if using GitHub integration)
2. Or deploy manually using the Vercel CLI:
   ```bash
   vercel --prod
   ```

## Custom Domains

To use a custom domain:

1. Go to your Vercel project settings
2. Navigate to the "Domains" section
3. Add your domain and follow the verification steps

## Support

If you encounter any issues, please refer to:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Vercel Documentation](https://vercel.com/docs)
