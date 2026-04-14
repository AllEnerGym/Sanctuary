import React from 'react';
import { Accessibility, User, Dumbbell, Wind, Plus, Clock, History, Lightbulb, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useToast } from './Toast';
import { useApp } from './AppContext';

const ACTIVITY_TYPES = [
  { id: 'stand', title: '简单站立', icon: User, color: 'bg-blue-500' },
  { id: 'stretch', title: '颈部拉伸', icon: Accessibility, color: 'bg-green-500' },
  { id: 'shoulder', title: '肩部环绕', icon: Dumbbell, color: 'bg-purple-500' },
  { id: 'breath', title: '深呼吸', icon: Wind, color: 'bg-teal-500' },
];

export default function ActivityView() {
  const { showToast } = useToast();
  const { standUpLogs, standUpCount, settings, addStandUpLog, activityTip, t } = useApp();

  const progress = Math.min(Math.round((standUpCount / settings.standUpGoal) * 100), 100);
  const isOverflow = standUpCount >= settings.standUpGoal;

  // SVG Circumference calculation: 2 * PI * r
  // r = 45% of 256px (w-64) = 115.2px
  const circumference = 2 * Math.PI * 115.2;

  const handleLogActivity = (title: string, type: string) => {
    addStandUpLog(title, type);
    showToast(`已记录：${title}`, 'success');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-20">
      {/* Left Column: Progress & Logging */}
      <div className="md:col-span-7 space-y-8">
        <section className={cn(
          "relative rounded-[40px] p-10 flex flex-col items-center text-center overflow-hidden transition-all duration-700",
          isOverflow ? "bg-primary text-on-primary shadow-2xl shadow-primary/30" : "bg-surface-container-lowest border border-outline-variant/10"
        )}>
          {isOverflow && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
            >
              {[...Array(6)].map((_, i) => (
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
            {t.stepsCompletion}
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
                className={cn("drop-shadow-lg", isOverflow ? "text-white" : "text-primary")}
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
                key={standUpCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-6xl font-black font-headline tracking-tighter">
                  {standUpCount}
                </span>
                <span className={cn("text-xs font-black uppercase tracking-widest mt-1", isOverflow ? "text-white/60" : "text-outline")}>
                  / {settings.standUpGoal} 次
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
            {isOverflow ? t.standUpGoalReached : t.standUpKeepGoing}
          </p>
        </section>

        <div className="grid grid-cols-2 gap-4">
          {ACTIVITY_TYPES.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => handleLogActivity(type.title, type.id)}
                className="bg-surface-container-lowest border border-outline-variant/10 p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-surface-container-low hover:scale-[1.02] active:scale-95 transition-all group"
              >
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12", type.color)}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-sm text-on-surface">{type.title}</span>
                <Plus className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />
              </button>
            );
          })}
        </div>

        {/* Health Tip Section */}
        <motion.div 
          key={activityTip}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/10 p-6 rounded-3xl flex gap-4 items-start"
        >
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-primary uppercase tracking-widest mb-1">{t.healthInsight}</h4>
            <p className="text-sm font-bold text-on-surface-variant leading-relaxed">{activityTip}</p>
          </div>
        </motion.div>
      </div>

      {/* Right Column: Recent Logs */}
      <div className="md:col-span-5 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="font-headline text-lg font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> {t.recentActivity}
          </h3>
          <span className="text-xs font-black text-outline uppercase tracking-widest">{standUpLogs.length} 条记录</span>
        </div>

        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {standUpLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-surface-container-low/50 border border-outline-variant/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Accessibility className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{log.title}</div>
                    <div className="text-[10px] text-outline font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {log.time}
                    </div>
                  </div>
                </div>
                <div className="text-xs font-black text-primary/40 group-hover:text-primary transition-colors">+1</div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {standUpLogs.length === 0 && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-outline/30">
                <History className="w-8 h-8" />
              </div>
              <p className="text-sm font-bold text-outline">暂无活动记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
