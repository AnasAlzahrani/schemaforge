-- SchemaForge v2 (Aqrab) — Supabase Credit System Migration
-- Run in Supabase SQL Editor
-- Date: 2026-03-19

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  credits_remaining INTEGER DEFAULT 5,
  credits_total_used INTEGER DEFAULT 0,
  trial_used BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS credit_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  credits_purchased INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  stripe_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_credit_purchases_email ON credit_purchases(user_email);

CREATE OR REPLACE FUNCTION decrement_credit(user_email TEXT)
RETURNS void AS $$
BEGIN
  UPDATE users
  SET credits_remaining = credits_remaining - 1,
      credits_total_used = credits_total_used + 1,
      updated_at = now()
  WHERE email = user_email
  AND credits_remaining > 0;
END;
$$ LANGUAGE plpgsql;
