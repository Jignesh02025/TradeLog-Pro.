-- 0. Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  avatar_url TEXT,
  account_currency TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 0.1 Create settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  default_currency TEXT DEFAULT 'USD',
  risk_percentage NUMERIC DEFAULT 1.0,
  theme TEXT DEFAULT 'dark',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Enable RLS on settings
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Settings Policies
CREATE POLICY "Users can view their own settings" ON settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON settings FOR UPDATE USING (auth.uid() = user_id);

-- 1. Create trades table
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date TIMESTAMP WITHOUT TIME ZONE NOT NULL,
  pair TEXT NOT NULL,
  type TEXT NOT NULL,
  lot_size NUMERIC NOT NULL,
  entry_price NUMERIC NOT NULL,
  exit_price NUMERIC NOT NULL,
  stop_loss NUMERIC,
  take_profit NUMERIC,
  pips NUMERIC NOT NULL,
  pip_value NUMERIC NOT NULL,
  profit_loss NUMERIC NOT NULL,
  manual_override BOOLEAN DEFAULT FALSE,
  risk_reward NUMERIC,
  trade_result TEXT,
  notes TEXT,
  screenshot_url TEXT,
  external_id TEXT UNIQUE,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Users can only view their own trades
CREATE POLICY "Users can view their own trades" 
ON trades FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own trades
CREATE POLICY "Users can insert their own trades" 
ON trades FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own trades
CREATE POLICY "Users can update their own trades" 
ON trades FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can only delete their own trades
CREATE POLICY "Users can delete their own trades" 
ON trades FOR DELETE 
USING (auth.uid() = user_id);

-- 4. Create Storage Bucket for screenshots
-- Run this in the Supabase Dashboard: Storage -> New Bucket -> "screenshots" (Make it public)

-- 5. Storage Policies (Optional but recommended if bucket is private)
-- For a public bucket, users can still be restricted to only upload to their own folder:
-- screenshots/USER_ID/filename.jpg
-- 6. Create AI Chat Cache table
CREATE TABLE IF NOT EXISTS ai_chat_cache (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL
);

-- Enable RLS on ai_chat_cache
ALTER TABLE ai_chat_cache ENABLE ROW LEVEL SECURITY;

-- Cache Policies
CREATE POLICY "Users can view their own cache" ON ai_chat_cache FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own cache" ON ai_chat_cache FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_cache_user_question ON ai_chat_cache(user_id, question);
