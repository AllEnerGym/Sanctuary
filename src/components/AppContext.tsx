import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import * as api from '../lib/api';

export const translations = {
  zh: {
    dashboard: '主页',
    water: '饮水',
    activity: '活动',
    profile: '个人中心',
    vitalityStatus: '今日状态',
    steps: '起身次数',
    stepsCompletion: '起身完成度',
    waterCompletion: '饮水完成度',
    standUpTitle: '起身活动',
    standUpDesc: '记录一次起身活动',
    nextBreak: '距离下次休息',
    iAmUp: '我已起身',
    stayHydrated: '保持水分',
    log250: '记录 250ml 饮水',
    dailyRitual: '每日仪式',
    activityRecap: '运动回顾',
    recentActivity: '最近记录',
    dailyVitality: '每日活力',
    customVolume: '自定义容量',
    otherDrinks: '喝了其他的饮品？',
    healthInsight: '健康小贴士',
    privacyTitle: '隐私与数据安全',
    advancedSettings: '高级设置',
    language: '显示语言',
    reminders: '智能提醒',
    soundEffects: '音效开关',
    waterGoal: '每日饮水目标',
    standUpGoal: '每日起身目标',
    workHours: '工作时间',
    logout: '退出登录',
    login: '立即登录',
    saveChanges: '保存所有更改',
    connected: '已确认',
    goalReached: '太棒了！你已完成今日目标。',
    keepGoing: '就要达到了！保持状态。',
    overflow: '目标达成！你做得非常出色。',
    standUpGoalReached: '起身目标已达成！',
    standUpKeepGoing: '再接再厉，远离久坐。',
    changeAvatar: '更换头像'
  },
  en: {
    dashboard: 'Home',
    water: 'Hydration',
    activity: 'Activity',
    profile: 'Profile',
    vitalityStatus: 'Today\'s Status',
    steps: 'Stand Up Count',
    stepsCompletion: 'Stand Progress',
    waterCompletion: 'Water Progress',
    standUpTitle: 'Stand Up',
    standUpDesc: 'Log a stand up activity',
    nextBreak: 'Next Break In',
    iAmUp: 'I\'m Up',
    stayHydrated: 'Stay Hydrated',
    log250: 'Log 250ml Water',
    dailyRitual: 'Daily Ritual',
    activityRecap: 'Activity Recap',
    recentActivity: 'Recent Activity',
    dailyVitality: 'Daily Vitality',
    customVolume: 'Custom Volume',
    otherDrinks: 'Had other drinks?',
    healthInsight: 'Health Insight',
    privacyTitle: 'Privacy & Data',
    advancedSettings: 'Advanced Settings',
    language: 'Language',
    reminders: 'Smart Reminders',
    soundEffects: 'Sound Effects',
    waterGoal: 'Daily Water Goal',
    standUpGoal: 'Daily Stand Goal',
    workHours: 'Work Hours',
    logout: 'Logout',
    login: 'Login',
    saveChanges: 'Save Changes',
    connected: 'Confirmed',
    goalReached: 'Great! Goal reached.',
    keepGoing: 'Almost there! Keep it up.',
    overflow: 'Goal Exceeded! Excellent work.',
    standUpGoalReached: 'Stand goal reached!',
    standUpKeepGoing: 'Keep moving, stay active.',
    changeAvatar: 'Change Avatar'
  }
};

const WATER_TIPS = [
  "水是生命之源，占人体重量的 60% 以上。",
  "口渴时说明身体已经处于轻微脱水状态了。",
  "多喝水可以帮助皮肤保持弹性，减少皱纹。",
  "饭前喝一杯水可以增加饱腹感，有助于控制体重。",
  "充足的水分可以提高大脑的反应速度和注意力。",
  "早起一杯温水可以唤醒肠胃，促进代谢。",
  "运动后补水应采取少量多次的原则。",
  "喝水有助于肾脏排出体内的代谢废物。",
  "身体脱水会导致疲劳和头痛。",
  "温水比冰水更容易被身体吸收。",
  "每天至少保证 8 杯水的摄入量。",
  "多喝水可以缓解便秘问题。",
  "感冒发烧时多喝水有助于调节体温。",
  "睡前不宜大量饮水，以免影响睡眠质量。",
  "纯净水是最好的水分来源，避免含糖饮料。",
  "喝水可以润滑关节，减少运动损伤。",
  "充足的水分有助于维持正常的体温。",
  "脱水会使血液变稠，增加心脏负担。",
  "喝水可以改善口气，减少口腔细菌。",
  "保持水分充足可以让心情更加愉悦。",
  "不要等到口渴才喝水，要定时定量补充。"
];

const ACTIVITY_TIPS = [
  "每坐一小时，建议起身活动 5 分钟。",
  "久坐会增加患心血管疾病的风险。",
  "起身拉伸可以缓解肌肉紧张和酸痛。",
  "简单的颈部环绕可以预防颈椎病。",
  "深呼吸有助于放松神经系统，减轻压力。",
  "站立办公可以消耗比坐着更多的热量。",
  "远眺窗外可以缓解用眼疲劳。",
  "走动几步可以促进下肢血液循环。",
  "保持良好的坐姿可以减少背部压力。",
  "经常起身活动可以提高工作效率。",
  "久坐会导致代谢减慢，容易堆积脂肪。",
  "拉伸可以增加身体的柔韧性和灵活性。",
  "饭后散步有助于消化和控制血糖。",
  "简单的扩胸运动可以改善心肺功能。",
  "保持活跃可以增强免疫系统。",
  "运动会释放内啡肽，让人感到快乐。",
  "即使是微小的活动也比完全不动要好。",
  "久坐是健康的“隐形杀手”。",
  "起身倒杯水也是一种很好的活动方式。",
  "坚持每天起身活动，身体会感谢你。"
];

const SOUNDS = {
  water_small: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  water_large: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  activity: 'https://assets.mixkit.co/active_storage/sfx/2002/2002-preview.mp3',
  goal: 'https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3',
};

interface ActivityRecord {
  id: string;
  title: string;
  time: string;
  type: string;
}

interface WaterLog {
  id: string;
  volume: number;
  time: string;
  label: string;
  subtitle: string;
}

interface UserSettings {
  language: 'zh' | 'en';
  waterGoal: number;
  standUpGoal: number;
  workStart: string;
  workEnd: string;
  sedentaryReminder: boolean;
  waterReminder: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
  id?: string;
}

interface AppContextType {
  // Water
  waterLogs: WaterLog[];
  totalWater: number;
  addWaterLog: (volume: number, label: string, subtitle: string) => void;
  waterTip: string;
  
  // Activities (Stand Up)
  standUpLogs: ActivityRecord[];
  standUpCount: number;
  addStandUpLog: (title: string, type: string) => void;
  activityTip: string;
  
  // Settings
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
  toggleNotifications: () => void;
  
  // User
  user: UserProfile;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateAvatar: (url: string) => Promise<boolean>;
  
  // UI State
  activeModal: string | null;
  modalData: any;
  openModal: (id: string, data?: any) => void;
  closeModal: () => void;
  isLoading: boolean;
  
  // Translation
  t: typeof translations.zh;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [standUpLogs, setStandUpLogs] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [settings, setSettings] = useState<UserSettings>({
    language: 'zh',
    waterGoal: 2000,
    standUpGoal: 12,
    workStart: '09:00',
    workEnd: '18:00',
    sedentaryReminder: true,
    waterReminder: true,
    notificationsEnabled: true,
    soundEnabled: true,
  });

  const [user, setUser] = useState<UserProfile>({
    name: '',
    email: '',
    avatar: 'https://picsum.photos/seed/user123/200/200',
    isLoggedIn: false,
  });

  const [waterTip, setWaterTip] = useState(WATER_TIPS[0]);
  const [activityTip, setActivityTip] = useState(ACTIVITY_TIPS[0]);

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<any>(null);

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  const totalWater = waterLogs.reduce((acc, log) => acc + log.volume, 0);
  const standUpCount = standUpLogs.length;
  const t = translations[settings.language];

  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  }, []);

  // Fetch all user-related data
  const fetchData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile
      const profile = await api.fetchProfile(userId);
      if (profile) {
        setUser(prev => ({
          ...prev,
          name: profile.name,
          avatar: profile.avatar_url || prev.avatar,
        }));
      }

      // 2. Fetch Settings
      const dbSettings = await api.fetchUserSettings(userId);
      if (dbSettings) {
        setSettings({
          language: dbSettings.language,
          waterGoal: dbSettings.water_goal,
          standUpGoal: dbSettings.stand_up_goal,
          workStart: dbSettings.work_start,
          workEnd: dbSettings.work_end,
          sedentaryReminder: dbSettings.sedentary_reminder,
          waterReminder: dbSettings.water_reminder,
          notificationsEnabled: dbSettings.notifications_enabled,
          soundEnabled: dbSettings.sound_enabled,
        });
      }

      // 3. Fetch Water Logs
      const dbWaterLogs = await api.fetchTodayWaterLogs(userId);
      setWaterLogs(dbWaterLogs.map(log => ({
        id: log.id,
        volume: log.volume,
        label: log.label,
        subtitle: log.subtitle,
        time: new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));

      // 4. Fetch Activity Logs
      const dbActivityLogs = await api.fetchTodayStandUpLogs(userId);
      setStandUpLogs(dbActivityLogs.map(log => ({
        id: log.id,
        title: log.title,
        type: log.type,
        time: new Date(log.logged_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })));

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auth Listener and Initial Check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(prev => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || '',
          isLoggedIn: true
        }));
        await fetchData(session.user.id);
      } else {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setUser(prev => ({
          ...prev,
          id: session.user.id,
          email: session.user.email || '',
          isLoggedIn: true
        }));
        await fetchData(session.user.id);
      } else {
        setUser({
          name: '',
          email: '',
          avatar: 'https://picsum.photos/seed/user123/200/200',
          isLoggedIn: false,
        });
        setWaterLogs([]);
        setStandUpLogs([]);
        setSettings({
          language: 'zh',
          waterGoal: 2000,
          standUpGoal: 12,
          workStart: '09:00',
          workEnd: '18:00',
          sedentaryReminder: true,
          waterReminder: true,
          notificationsEnabled: true,
          soundEnabled: true,
        });
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchData]);

  // Request permission on load
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  // Hourly Reminder Logic
  useEffect(() => {
    if (notificationPermission !== 'granted' || !settings.notificationsEnabled) return;

    const checkReminders = () => {
      const now = new Date();
      const currentMinute = now.getMinutes();
      
      const [startH, startM] = settings.workStart.split(':').map(Number);
      const [endH, endM] = settings.workEnd.split(':').map(Number);
      
      const currentTimeInMinutes = now.getHours() * 60 + currentMinute;
      const startTimeInMinutes = startH * 60 + startM;
      const endTimeInMinutes = endH * 60 + endM;

      if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
        // 每个整点（第 0 分钟）发送一次联合提醒
        if (currentMinute === 0) {
          new Notification('Sanctuary 活力提醒', {
            body: '现在是整点时间：请喝一杯水并起身活动几分钟。保持状态！💧🏃',
            icon: '/favicon.ico'
          });
        }
      }
    };

    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [notificationPermission, settings.notificationsEnabled, settings.workStart, settings.workEnd]);

  const playSound = useCallback((type: keyof typeof SOUNDS) => {
    if (!settings.soundEnabled) return;
    const audio = new Audio(SOUNDS[type]);
    audio.play().catch(e => console.warn('Audio play failed:', e));
  }, [settings.soundEnabled]);

  const addWaterLog = useCallback(async (volume: number, label: string, subtitle: string) => {
    if (!user.isLoggedIn || !user.id) return;
    
    // 1. Optimistic Update
    const tempId = Math.random().toString(36).substring(2, 9);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localLog: WaterLog = { id: tempId, volume, time: timeStr, label, subtitle };
    
    const prevTotal = totalWater;
    setWaterLogs(prev => [localLog, ...prev]);
    
    // 使用默认饮水音效
    playSound('water_small');

    if (prevTotal < settings.waterGoal && (prevTotal + volume) >= settings.waterGoal) {
      playSound('goal'); // 达成目标音效
    }
    setWaterTip(WATER_TIPS[Math.floor(Math.random() * WATER_TIPS.length)]);

    // 2. Sync with DB
    const dbLog = await api.addWaterLog(user.id, { volume, label, subtitle });
    if (dbLog) {
      // Update with real ID from database
      setWaterLogs(prev => prev.map(l => l.id === tempId ? { ...l, id: dbLog.id } : l));
    }
  }, [totalWater, settings.waterGoal, playSound, user.isLoggedIn, user.id]);

  const addStandUpLog = useCallback(async (title: string, type: string) => {
    if (!user.isLoggedIn || !user.id) return;

    // 1. Optimistic Update
    const tempId = Math.random().toString(36).substring(2, 9);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const localLog: ActivityRecord = { id: tempId, title, time: timeStr, type };
    
    const prevCount = standUpCount;
    setStandUpLogs(prev => [localLog, ...prev]);
    
    // 使用默认活动音效
    playSound('activity');

    if (prevCount < settings.standUpGoal && (prevCount + 1) >= settings.standUpGoal) {
      playSound('goal'); // 达成目标音效
    }
    setActivityTip(ACTIVITY_TIPS[Math.floor(Math.random() * ACTIVITY_TIPS.length)]);

    // 2. Sync with DB
    const dbLog = await api.addStandUpLog(user.id, { title, type });
    if (dbLog) {
      setStandUpLogs(prev => prev.map(l => l.id === tempId ? { ...l, id: dbLog.id } : l));
    }
  }, [standUpCount, settings.standUpGoal, playSound, user.isLoggedIn, user.id]);

  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    if (user.isLoggedIn && user.id) {
      await api.upsertUserSettings(user.id, {
        language: updated.language,
        water_goal: updated.waterGoal,
        stand_up_goal: updated.standUpGoal,
        work_start: updated.workStart,
        work_end: updated.workEnd,
        sedentary_reminder: updated.sedentaryReminder,
        water_reminder: updated.waterReminder,
        notifications_enabled: updated.notificationsEnabled,
        sound_enabled: updated.soundEnabled,
      });
    }
  }, [settings, user.isLoggedIn, user.id]);

  const toggleNotifications = useCallback(() => {
    updateSettings({ notificationsEnabled: !settings.notificationsEnabled });
  }, [settings.notificationsEnabled, updateSettings]);

  const login = useCallback(async (username: string, password: string) => {
    // Convert username to virtual email for Supabase
    const email = `${username.trim()}@sanctuary.com`;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    const email = `${username.trim()}@sanctuary.com`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: username }
      }
    });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const updateAvatar = useCallback(async (url: string) => {
    if (!user.isLoggedIn || !user.id) return false;
    try {
      const success = await api.updateProfile(user.id, { avatar_url: url });
      if (success) {
        setUser(prev => ({ ...prev, avatar: url }));
        return true;
      }
      return false;
    } catch (e) {
      console.error('Avatar update error:', e);
      return false;
    }
  }, [user.isLoggedIn, user.id]);

  const openModal = useCallback((id: string, data?: any) => {
    setActiveModal(id);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  // Update tips periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterTip(WATER_TIPS[Math.floor(Math.random() * WATER_TIPS.length)]);
      setActivityTip(ACTIVITY_TIPS[Math.floor(Math.random() * ACTIVITY_TIPS.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{
      waterLogs,
      totalWater,
      addWaterLog,
      waterTip,
      standUpLogs,
      standUpCount,
      addStandUpLog,
      activityTip,
      settings,
      updateSettings,
      toggleNotifications,
      user,
      login,
      register,
      logout,
      updateAvatar,
      activeModal,
      modalData,
      openModal,
      closeModal,
      isLoading,
      t
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
