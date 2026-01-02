"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Zap, Star, Sparkles } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from '@/hooks/useWindowSize';

interface LevelUpModalProps {
  show: boolean;
  level: number;
  onClose: () => void;
}

export function LevelUpModal({ show, level, onClose }: LevelUpModalProps) {
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (show) {
      setShowConfetti(true);
      const timer = setTimeout(() => {
        setShowConfetti(false);
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <>
          {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-12 rounded-3xl shadow-2xl text-center max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                <Trophy className="h-24 w-24 mx-auto mb-6 text-white drop-shadow-xl" />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl font-bold text-white mb-4 drop-shadow-lg"
              >
                LEVEL UP!
              </motion.h2>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-8xl font-bold text-white mb-6 drop-shadow-2xl"
              >
                {level}
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-2xl text-white/90 mb-6 drop-shadow"
              >
                You've reached a new level!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex justify-center gap-4"
              >
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                  <Zap className="h-5 w-5 text-yellow-200" />
                  <span className="text-white font-bold">+50 XP Boost</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full">
                  <Star className="h-5 w-5 text-yellow-200" />
                  <span className="text-white font-bold">+100 Coins</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mt-8 flex justify-center gap-2"
              >
                <Sparkles className="h-6 w-6 text-yellow-200" />
                <Sparkles className="h-6 w-6 text-white" />
                <Sparkles className="h-6 w-6 text-yellow-200" />
              </motion.div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
