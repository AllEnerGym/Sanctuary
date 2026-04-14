-- ============================================================
-- Sanctuary App - Supabase Database Schema
-- 在 Supabase SQL Editor 中执行此文件以初始化数据库
-- ============================================================

-- ============================================================
-- 1. profiles 表（扩展 auth.users）
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL DEFAULT '',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 自动为新注册用户创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. user_settings 表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  language               text NOT NULL DEFAULT 'zh',
  water_goal             int4 NOT NULL DEFAULT 2000,
  stand_up_goal          int4 NOT NULL DEFAULT 12,
  work_start             text NOT NULL DEFAULT '09:00',
  work_end               text NOT NULL DEFAULT '18:00',
  sound_enabled          bool NOT NULL DEFAULT true,
  notifications_enabled  bool NOT NULL DEFAULT true,
  sedentary_reminder     bool NOT NULL DEFAULT true,
  water_reminder         bool NOT NULL DEFAULT true,
  updated_at             timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- ============================================================
-- 3. water_logs 表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.water_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  volume     int4 NOT NULL,
  label      text NOT NULL DEFAULT '',
  subtitle   text NOT NULL DEFAULT '',
  logged_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 4. stand_up_logs 表
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stand_up_logs (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title      text NOT NULL,
  type       text NOT NULL DEFAULT 'stand',
  logged_at  timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 5. Row Level Security (RLS) 策略
-- ============================================================

-- profiles RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- user_settings RLS
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own settings" ON public.user_settings;
CREATE POLICY "Users can manage their own settings"
  ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- water_logs RLS
ALTER TABLE public.water_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own water logs" ON public.water_logs;
CREATE POLICY "Users can manage their own water logs"
  ON public.water_logs FOR ALL USING (auth.uid() = user_id);

-- stand_up_logs RLS
ALTER TABLE public.stand_up_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own stand up logs" ON public.stand_up_logs;
CREATE POLICY "Users can manage their own stand up logs"
  ON public.stand_up_logs FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 完成！请在 Supabase SQL Editor 中执行此文件。
-- ============================================================
