# BLOX Authentication Setup

## Required Environment Variables

Create a `.env.local` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_URL=https://blox.onecs.net
```

## Supabase Configuration

1. In your Supabase project dashboard, go to Authentication → URL Configuration
2. Set Site URL: `https://blox.onecs.net`
3. Add Additional Redirect URLs:
   - `https://blox.onecs.net/*`
   - `http://localhost:3000/*`
   - `https://*.vercel.app/*`

4. Enable authentication providers:
   - Email (magic link)
   - Optional: Google, Microsoft OAuth

## Testing Authentication

1. Start the dev server: `npm run dev`
2. Visit `/app` - should redirect to `/signin`
3. Enter email and click "Send magic link"
4. Check email and click the link
5. Should redirect back to `/app` with user session

## Vercel Deployment Configuration

### Environment Variables
In your Vercel project settings, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: https://zrabnmyzaorxjklaafva.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key  
- `NEXT_PUBLIC_APP_URL`: https://blox.onecs.net

### Supabase Redirect URLs
In Supabase dashboard → Authentication → URL Configuration, add:
- `https://blox.onecs.net/auth/confirm`
- `https://blox-app-nine.vercel.app/auth/confirm`
- `https://blox-4oe9lauzg-ebarlowjr2s-projects.vercel.app/auth/confirm`
- `https://*.vercel.app/auth/confirm` (for preview deployments)

### Testing on Vercel
1. Deploy to Vercel with environment variables configured
2. Visit `/app` - should redirect to `/signin`
3. Enter email and send magic link
4. Click link in email - should authenticate and redirect to `/app`
