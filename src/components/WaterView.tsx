import React, { useState } from 'react';
import { Droplets, Plus, History, Clock, Sparkles, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useToast } from './Toast';
import { useApp } from './AppContext';

export default function WaterView() {
  const [customVolume, setCustomVolume] = useState('');
  const { showToast } = useToast();
  const { waterLogs, totalWater, settings, addWaterLog, waterTip, t } = useApp();

  const progress = Math.min(Math.round((totalWater / settings.waterGoal) * 100), 100);
  const isOverflow = totalWater >= settings.waterGoal;

  // SVG Circumference calculation: 2 * PI * r
  // r = 45% of 256px (w-64) = 115.2px
  const circumference = 2 * Math.PI * 115.2;

  const handleAddWater = (volume: number, label: string) => {
    addWaterLog(volume, label, '手动记录');
    showToast(`已记录 ${volume}ml 饮水`, 'success');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vol = parseInt(customVolume);
    if (vol > 0) {
      handleAddWater(vol, '自定义饮水');
      setCustomVolume('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20">
      {/* Left Column: Progress & Logging */}
      <div className="md:col-span-7 space-y-8">
        {/* Hydration Card */}
        <section className={cn(
          "relative rounded-[40px] p-10 flex flex-col items-center text-center overflow-hidden transition-all duration-700",
          isOverflow ? "bg-primary text-on-primary shadow-2xl shadow-primary/30" : "bg-surface-container-lowest border border-outline-variant/10"
        )}>
          {/* Overflow Effects */}
          {isOverflow && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ y: 100, x: Math.random() * 300 - 150, opacity: 0 }}
                  animate={{ y: -200, opacity: [0, 1, 0] }}
                  transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute bottom-0 left-1/2 w-1 h-1 bg-white/40 rounded-full"
                />
              ))}
            </motion.div>
          )}

          <h2 className={cn("font-headline text-xl font-bold mb-8", isOverflow ? "text-white/80" : "text-outline")}>
            {t.waterCompletion}
          </h2>

          <div className="relative w-64 h-64 mb-8">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
              <circle
                className={isOverflow ? "text-white/10" : "text-surface-container-low"}
                cx="128"
                cy="128"
                fill="transparent"
                r="115.2"
                stroke="currentColor"
                strokeWidth="12"
              ></circle>
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (circumference * progress) / 100 }}
                className={cn("drop-shadow-lg", isOverflow ? "text-white" : "text-secondary")}
                cx="128"
                cy="128"
                fill="transparent"
                r="115.2"
                stroke="currentColor"
                strokeDasharray={circumference}
                strokeLinecap="round"
                strokeWidth="12"
                transition={{ duration: 1.5, ease: "easeOut" }}
              ></motion.circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                key={totalWater}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-baseline gap-1">
                  <span className="text-6xl font-black font-headline tracking-tighter">
                    {totalWater}
                  </span>
                  <span className="text-sm font-bold opacity-60">ml</span>
                </div>
                <span className={cn("text-xs font-black uppercase tracking-widest mt-1", isOverflow ? "text-white/60" : "text-outline")}>
                  / {settings.waterGoal}ml
                </span>
              </motion.div>
            </div>
            {isOverflow && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 bg-white text-primary p-2 rounded-full shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            )}
          </div>

          <p className={cn("text-sm font-bold max-w-[200px] leading-relaxed", isOverflow ? "text-white" : "text-on-surface-variant")}>
            {isOverflow ? t.overflow : t.keepGoing}
          </p>
        </section>

        {/* Quick Log Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleAddWater(250, '一杯水')}
            className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-surface-container-low hover:scale-[1.02] active:scale-95 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-sm transition-transform group-hover:rotate-12">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-on-surface">250ml</span>
            <Plus className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={() => handleAddWater(500, '一瓶水')}
            className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-surface-container-low hover:scale-[1.02] active:scale-95 transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm transition-transform group-hover:-rotate-12">
              <Droplets className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-on-surface">500ml</span>
            <Plus className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
          </button>
        </div>

        {/* Custom Volume Input */}
        <form onSubmit={handleCustomSubmit} className="relative max-w-sm">
          <input
            type="number"
            value={customVolume}
            onChange={(e) => setCustomVolume(e.target.value)}
            placeholder={t.customVolume}
            className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-2xl px-6 py-3.5 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-on-primary px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
          >
            记录
          </button>
        </form>

        {/* Health Tip Section */}
        <motion.div 
          key={waterTip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-secondary/5 border border-secondary/10 p-6 rounded-3xl flex gap-4 items-start"
        >
          <div className="p-2 bg-secondary/10 rounded-xl text-secondary">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-secondary uppercase tracking-widest mb-1">{t.healthInsight}</h4>
            <p className="text-sm font-bold text-on-surface-variant leading-relaxed">{waterTip}</p>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Recent Logs */}
      <div className="md:col-span-5 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-headline text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> {t.recentActivity}
          </h3>
          <span className="text-xs font-black text-outline uppercase tracking-widest">{waterLogs.length} 条记录</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {waterLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-surface-container-low/50 border border-outline-variant/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{log.label}</div>
                    <div className="text-[10px] text-outline font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.time}
                    </div>
                  </div>
                </div>
                <div className="text-sm font-black text-secondary/60 group-hover:text-secondary transition-colors">+{log.volume}ml</div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {waterLogs.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-outline/30">
                <History className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-outline">暂无饮水记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
