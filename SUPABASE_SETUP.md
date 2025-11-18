# Supabase Setup Instructions

## Step 1: Create your .env file

Create a file named `.env` in the root of your project (`C:\Users\nafia\Music\Taskly-\`) with the following content:

```
VITE_SUPABASE_URL=https://lohrbptnbtrjvlkhuqcg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaHJicHRuYnRyanZsa2h1cWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE4NDcsImV4cCI6MjA3MTYzNzg0N30.-0OmCHMBtLNMO5BaoT7WC7uDFgI9vbb7esbpt_NC0DA
```

### How to create the .env file:

**Option 1: Using PowerShell**
1. Open PowerShell in your project directory
2. Run this command:

```powershell
@"
VITE_SUPABASE_URL=https://lohrbptnbtrjvlkhuqcg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvaHJicHRuYnRyanZsa2h1cWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNjE4NDcsImV4cCI6MjA3MTYzNzg0N30.-0OmCHMBtLNMO5BaoT7WC7uDFgI9vbb7esbpt_NC0DA
"@ | Out-File -FilePath .env -Encoding utf8
```

**Option 2: Using Notepad**
1. Open Notepad
2. Copy and paste the content above
3. Save as `.env` (not `.env.txt`) in `C:\Users\nafia\Music\Taskly-\`

## Step 2: Set up your database

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/lohrbptnbtrjvlkhuqcg
2. Click on **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy the entire content from `supabase/migrations/20241118000000_initial_schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the SQL

This will create all the necessary tables, policies, and triggers for your app.

## Step 3: Restart your development server

1. Stop your current dev server (Ctrl+C in the terminal)
2. Run `npm run dev` again

The "Using mock Supabase client" warning should disappear, and your app will now be connected to a real database!

## Verification

After restarting, you should see:
- ✅ No more "Using mock Supabase client" warning
- ✅ Your app loads normally
- ✅ You can sign up/login
- ✅ Data persists after page refresh

---

**Note:** The `.env` file is already in your `.gitignore`, so it won't be committed to git. This is important for security!

