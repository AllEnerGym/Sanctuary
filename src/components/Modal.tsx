import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useApp } from './AppContext';

export default function Modal() {
  const { activeModal, modalData, closeModal } = useApp();

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeModal}
          className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="font-headline text-2xl font-bold text-on-surface">
                {modalData?.title || '详情'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-outline" />
              </button>
            </div>
            
            <div className="space-y-4 text-on-surface-variant">
              {modalData?.content ? (
                <div className="leading-relaxed">{modalData.content}</div>
              ) : (
                <p>暂无更多详细信息。</p>
              )}
              
              {modalData?.stats && (
                <div className="grid grid-cols-2 gap-4 mt-8">
                  {Object.entries(modalData.stats).map(([key, value]: [string, any]) => (
                    <div key={key} className="bg-surface-container-low p-4 rounded-xl">
                      <p className="text-xs font-medium uppercase tracking-wider text-outline mb-1">{key}</p>
                      <p className="text-lg font-bold text-primary">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-10">
              <button
                onClick={closeModal}
                className="w-full vitality-gradient text-white font-bold py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                确定
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
