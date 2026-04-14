import React, { useState } from 'react';
import { Edit2, Globe, Droplets, Clock, Camera, Settings, Volume2, LogOut, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useToast } from './Toast';
import { useApp } from './AppContext';

export default function ProfileView() {
  const { showToast } = useToast();
  const { settings, updateSettings, t, user, login, register, logout, updateAvatar, isLoading } = useApp();
  const [isRegistering, setIsRegistering] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleLanguageChange = (lang: 'zh' | 'en') => {
    updateSettings({ language: lang });
    showToast(lang === 'zh' ? '语言已切换为中文' : 'Language switched to English', 'info');
  };

  const handleChangeAvatar = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // 限制文件大小，避免数据库写入过大
        if (file.size > 1024 * 1024) {
          showToast('图片太大，请选择 1MB 以下的图片', 'error');
          return;
        }
        
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const success = await updateAvatar(event.target.result as string);
            if (success) {
              showToast('头像已同步至云端', 'success');
            } else {
              showToast('同步失败，请重试', 'error');
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthLoading(true);
    const formData = new FormData(e.currentTarget);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      if (isRegistering) {
        await register(username, password);
        showToast('注册成功！', 'success');
      } else {
        await login(username, password);
        showToast('登录成功', 'success');
      }
    } catch (error: any) {
      showToast(error.message || '操作失败', 'error');
    } finally {
      setAuthLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-surface-container-lowest">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 font-black text-outline uppercase tracking-widest text-[10px]">同步中...</p>
      </div>
    );
  }

  if (!user.isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-surface-container-lowest">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-surface-container-low p-10 rounded-[48px] w-full max-w-sm shadow-2xl border border-outline-variant/10"
        >
          <div className="flex bg-surface-container-lowest rounded-2xl p-1 mb-8 shadow-inner">
            <button 
              onClick={() => setIsRegistering(false)}
              className={cn(
                "flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                !isRegistering ? "bg-primary text-on-primary shadow-md" : "text-outline hover:bg-surface-variant/30"
              )}
            >
              {t.login}
            </button>
            <button 
              onClick={() => setIsRegistering(true)}
              className={cn(
                "flex-1 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                isRegistering ? "bg-primary text-on-primary shadow-md" : "text-outline hover:bg-surface-variant/30"
              )}
            >
              注册
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isRegistering ? 'register' : 'login'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-8">
                <h2 className="text-4xl font-black font-headline tracking-tighter text-on-surface">Sanctuary</h2>
                <p className="text-[10px] text-outline mt-1 font-black uppercase tracking-[0.3em]">
                  {isRegistering ? '开启您的健康仪式' : '欢迎回来'}
                </p>
              </div>
              
              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-4">用户名</label>
                  <input 
                    name="username"
                    type="text" 
                    required
                    placeholder="请输入您的用户名"
                    className="w-full bg-surface-container-lowest border border-outline-variant/5 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-outline ml-4">密码</label>
                  <input 
                    name="password"
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full bg-surface-container-lowest border border-outline-variant/5 rounded-2xl px-6 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-primary text-on-primary py-5 rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 mt-4 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isRegistering ? '立即开始' : '进入系统')}
                </button>
              </form>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      {/* Profile Header */}
      <section className="bg-surface-container-low rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-surface-container-lowest shadow-xl">
            <img
              alt="用户头像"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              src={user.avatar}
              referrerPolicy="no-referrer"
            />
          </div>
          <button 
            onClick={handleChangeAvatar}
            className="absolute bottom-1 right-1 p-2 bg-primary text-on-primary rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all"
            title={t.changeAvatar}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-6">
          <h2 className="font-headline text-3xl font-black tracking-tight">{user.name}</h2>
          <p className="text-outline font-medium mt-1">{user.email}</p>
        </div>
      </section>

      {/* Settings Groups */}
      <div className="space-y-6">
        {/* App Settings */}
        <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant/10 bg-surface-container-low/30">
            <h3 className="text-xs font-black text-outline uppercase tracking-widest flex items-center gap-2">
              <Settings className="w-3 h-3" /> 应用偏好
            </h3>
          </div>
          <div className="divide-y divide-outline-variant/10">
            {/* Language */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.language}</div>
                  <div className="text-xs text-outline">{settings.language === 'zh' ? '简体中文' : 'English'}</div>
                </div>
              </div>
              <div className="flex bg-surface-container-high rounded-full p-1 gap-1">
                <button 
                  onClick={() => handleLanguageChange('zh')}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-full transition-all",
                    settings.language === 'zh' ? "bg-primary text-white shadow-sm" : "text-outline hover:bg-surface-variant/50"
                  )}
                >
                  中文
                </button>
                <button 
                  onClick={() => handleLanguageChange('en')}
                  className={cn(
                    "px-4 py-1.5 text-xs font-bold rounded-full transition-all",
                    settings.language === 'en' ? "bg-primary text-white shadow-sm" : "text-outline hover:bg-surface-variant/50"
                  )}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Sound Effects Toggle */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.soundEffects}</div>
                  <div className="text-xs text-outline">开启或关闭记录时的提示音</div>
                </div>
              </div>
              <button 
                onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                className={cn(
                  "w-12 h-6 rounded-full relative transition-colors duration-300",
                  settings.soundEnabled ? "bg-primary" : "bg-surface-container-highest"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300",
                  settings.soundEnabled ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            {/* Water Goal */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.waterGoal}</div>
                  <div className="text-xs text-outline">每日建议摄入量</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range"
                  min="1000"
                  max="5000"
                  step="100"
                  value={settings.waterGoal}
                  onChange={(e) => updateSettings({ waterGoal: parseInt(e.target.value) })}
                  className="w-32 accent-primary"
                />
                <span className="text-sm font-black w-16 text-right">{settings.waterGoal}ml</span>
              </div>
            </div>

            {/* Stand Up Goal */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.standUpGoal}</div>
                  <div className="text-xs text-outline">每日起身次数目标</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range"
                  min="4"
                  max="24"
                  step="1"
                  value={settings.standUpGoal}
                  onChange={(e) => updateSettings({ standUpGoal: parseInt(e.target.value) })}
                  className="w-32 accent-primary"
                />
                <span className="text-sm font-black w-16 text-right">{settings.standUpGoal}次</span>
              </div>
            </div>

            {/* Work Hours */}
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-sm">{t.workHours}</div>
                  <div className="text-xs text-outline">在此期间接收久坐提醒</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="time" 
                  value={settings.workStart}
                  onChange={(e) => updateSettings({ workStart: e.target.value })}
                  className="bg-surface-container-low px-2 py-1 rounded text-xs font-bold"
                />
                <span className="text-outline">-</span>
                <input 
                  type="time" 
                  value={settings.workEnd}
                  onChange={(e) => updateSettings({ workEnd: e.target.value })}
                  className="bg-surface-container-low px-2 py-1 rounded text-xs font-bold"
                />
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={logout}
          className="w-full py-6 text-error font-black uppercase tracking-[0.2em] text-sm hover:bg-error-container/10 transition-colors rounded-2xl flex items-center justify-center gap-2"
        >
          <LogOut className="w-4 h-4" /> {t.logout}
        </button>
      </div>
    </div>
  );
}
