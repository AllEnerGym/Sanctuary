import React from 'react';
import { Sparkles, Droplets, Accessibility } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useApp } from './AppContext';

export default function DashboardView() {
  const { totalWater, standUpCount, settings, t } = useApp();

  const waterProgress = Math.min(Math.round((totalWater / settings.waterGoal) * 100), 100);
  const standProgress = Math.min(Math.round((standUpCount / settings.standUpGoal) * 100), 100);
  
  const isWaterComplete = totalWater >= settings.waterGoal;
  const isStandComplete = standUpCount >= settings.standUpGoal;

  // SVG Circumference calculations: 
  // Outer circle (r=45% of 320px = 144px): 2 * PI * 144 ≈ 904.78
  // Inner circle (r=40% of 240px = 96px): 2 * PI * 96 ≈ 603.18
  const outerCircumference = 2 * Math.PI * 144;
  const innerCircumference = 2 * Math.PI * 96;

  return (
    <div className="flex flex-col items-center justify-center py-10 space-y-12">
      {/* Main Progress Rings Container */}
      <div className="relative w-80 h-80 flex items-center justify-center">
        {/* Outer Ring: Stand Up */}
        <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 320 320">
          <circle
            className="text-surface-container-low"
            cx="160"
            cy="160"
            fill="transparent"
            r="144"
            stroke="currentColor"
            strokeWidth="16"
          />
          <motion.circle
            initial={{ strokeDashoffset: outerCircumference }}
            animate={{ strokeDashoffset: outerCircumference - (outerCircumference * standProgress) / 100 }}
            className={cn("drop-shadow-lg transition-colors duration-500", isStandComplete ? "text-primary" : "text-primary/60")}
            cx="160"
            cy="160"
            fill="transparent"
            r="144"
            stroke="currentColor"
            strokeDasharray={outerCircumference}
            strokeLinecap="round"
            strokeWidth="16"
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Inner Ring: Water */}
        <svg className="absolute w-60 h-60 transform -rotate-90" viewBox="0 0 240 240">
          <circle
            className="text-surface-container-low"
            cx="120"
            cy="120"
            fill="transparent"
            r="96"
            stroke="currentColor"
            strokeWidth="16"
          />
          <motion.circle
            initial={{ strokeDashoffset: innerCircumference }}
            animate={{ strokeDashoffset: innerCircumference - (innerCircumference * waterProgress) / 100 }}
            className={cn("drop-shadow-lg transition-colors duration-500", isWaterComplete ? "text-secondary" : "text-secondary/60")}
            cx="120"
            cy="120"
            fill="transparent"
            r="96"
            stroke="currentColor"
            strokeDasharray={innerCircumference}
            strokeLinecap="round"
            strokeWidth="16"
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
        </svg>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.div
            key={`${standUpCount}-${totalWater}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-1"
          >
            {/* Stand Up Count */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="text-5xl font-black font-headline tracking-tighter text-on-surface">
                  {standUpCount}
                </span>
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">次</span>
              </div>
              <span className="text-[8px] font-black text-primary/60 uppercase tracking-[0.2em] -mt-1">
                {t.steps}
              </span>
            </div>

            {/* Divider */}
            <div className="w-8 h-[1px] bg-outline-variant/20 my-1"></div>

            {/* Water Volume */}
            <div className="flex flex-col items-center">
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-black font-headline tracking-tight text-secondary">
                  {totalWater}
                </span>
                <span className="text-[8px] font-bold text-outline uppercase">ml</span>
              </div>
              <span className="text-[8px] font-black text-secondary/60 uppercase tracking-[0.2em] -mt-1">
                {t.water}
              </span>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {(isWaterComplete || isStandComplete) && (
              <motion.div
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-12 bg-primary text-on-primary p-2 rounded-full shadow-xl"
              >
                <Sparkles className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-6 w-full max-w-md">
        <motion.div 
          whileHover={{ y: -5 }}
          className={cn(
            "p-6 rounded-[32px] flex flex-col items-center text-center space-y-3 transition-all duration-500",
            isStandComplete ? "bg-primary text-on-primary shadow-xl shadow-primary/20" : "bg-surface-container-low border border-outline-variant/10"
          )}
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isStandComplete ? "bg-white/20" : "bg-primary/10 text-primary")}>
            <Accessibility className="w-6 h-6" />
          </div>
          <div>
            <div className={cn("text-2xl font-black font-headline", isStandComplete ? "text-white" : "text-on-surface")}>{standProgress}%</div>
            <div className={cn("text-[10px] font-black uppercase tracking-widest", isStandComplete ? "text-white/60" : "text-outline")}>{t.stepsCompletion}</div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className={cn(
            "p-6 rounded-[32px] flex flex-col items-center text-center space-y-3 transition-all duration-500",
            isWaterComplete ? "bg-secondary text-on-secondary shadow-xl shadow-secondary/20" : "bg-surface-container-low border border-outline-variant/10"
          )}
        >
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", isWaterComplete ? "bg-white/20" : "bg-secondary/10 text-secondary")}>
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <div className={cn("text-2xl font-black font-headline", isWaterComplete ? "text-white" : "text-on-surface")}>{waterProgress}%</div>
            <div className={cn("text-[10px] font-black uppercase tracking-widest", isWaterComplete ? "text-white/60" : "text-outline")}>{t.waterCompletion}</div>
          </div>
        </motion.div>
      </div>

      {/* Motivation Text */}
      <div className="text-center px-6">
        <h3 className="font-headline text-xl font-black tracking-tight text-on-surface">
          {isWaterComplete && isStandComplete ? t.goalReached : (isWaterComplete || isStandComplete ? t.keepGoing : t.dailyVitality)}
        </h3>
        <p className="text-sm font-medium text-outline mt-1">
          {isWaterComplete && isStandComplete ? "你今天的表现非常完美！" : "继续保持，健康就在点滴之间。"}
        </p>
      </div>
    </div>
  );
}
