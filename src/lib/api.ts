/**
 * api.ts — 封装所有 Supabase 数据库操作
 * 前端组件通过此文件与 Supabase 交互
 */

import { supabase, DbProfile, DbUserSettings, DbWaterLog, DbStandUpLog } from './supabase';

// ─── 辅助：获取今日 ISO 日期范围 ────────────────────────────────────────────

function getTodayRange(): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

// ─── Profile ─────────────────────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<DbProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('[api] fetchProfile error:', error.message);
    return null;
  }
  return data as DbProfile;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Pick<DbProfile, 'name' | 'avatar_url'>>
): Promise<boolean> {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('[api] updateProfile error:', error.message);
    return false;
  }
  return true;
}

// ─── User Settings ───────────────────────────────────────────────────────────

export async function fetchUserSettings(userId: string): Promise<DbUserSettings | null> {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found，属于正常情况（首次登录）
    console.error('[api] fetchUserSettings error:', error.message);
    return null;
  }
  return (data as DbUserSettings) ?? null;
}

export async function upsertUserSettings(
  userId: string,
  settings: Omit<DbUserSettings, 'id' | 'user_id' | 'updated_at'>
): Promise<boolean> {
  const { error } = await supabase
    .from('user_settings')
    .upsert(
      { ...settings, user_id: userId, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    );

  if (error) {
    console.error('[api] upsertUserSettings error:', error.message);
    return false;
  }
  return true;
}

// ─── Water Logs ──────────────────────────────────────────────────────────────

export async function fetchTodayWaterLogs(userId: string): Promise<DbWaterLog[]> {
  const { start, end } = getTodayRange();
  const { data, error } = await supabase
    .from('water_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', start)
    .lt('logged_at', end)
    .order('logged_at', { ascending: false });

  if (error) {
    console.error('[api] fetchTodayWaterLogs error:', error.message);
    return [];
  }
  return (data as DbWaterLog[]) ?? [];
}

export async function addWaterLog(
  userId: string,
  log: Pick<DbWaterLog, 'volume' | 'label' | 'subtitle'>
): Promise<DbWaterLog | null> {
  const { data, error } = await supabase
    .from('water_logs')
    .insert({ ...log, user_id: userId, logged_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error('[api] addWaterLog error:', error.message);
    return null;
  }
  return data as DbWaterLog;
}

// ─── Stand Up Logs ───────────────────────────────────────────────────────────

export async function fetchTodayStandUpLogs(userId: string): Promise<DbStandUpLog[]> {
  const { start, end } = getTodayRange();
  const { data, error } = await supabase
    .from('stand_up_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('logged_at', start)
    .lt('logged_at', end)
    .order('logged_at', { ascending: false });

  if (error) {
    console.error('[api] fetchTodayStandUpLogs error:', error.message);
    return [];
  }
  return (data as DbStandUpLog[]) ?? [];
}

export async function addStandUpLog(
  userId: string,
  log: Pick<DbStandUpLog, 'title' | 'type'>
): Promise<DbStandUpLog | null> {
  const { data, error } = await supabase
    .from('stand_up_logs')
    .insert({ ...log, user_id: userId, logged_at: new Date().toISOString() })
    .select()
    .single();

  if (error) {
    console.error('[api] addStandUpLog error:', error.message);
    return null;
  }
  return data as DbStandUpLog;
}
