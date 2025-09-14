import { motion, AnimatePresence } from 'framer-motion';
import { UserProgress } from '@/types';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
interface LevelIndicatorProps {
  userProgress: UserProgress;
  showLevelUp?: boolean;
}
export const LevelIndicator = ({
  userProgress,
  showLevelUp = false
}: LevelIndicatorProps) => {
  const {
    t
  } = useLanguage();
  const [isAnimating, setIsAnimating] = useState(false);
  useEffect(() => {
    if (showLevelUp) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showLevelUp]);
  const progressPercentage = userProgress.experienceToNext > 0 ? userProgress.experience % 100 / 100 * 100 : 100;
  
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {t('level')} {userProgress.level}
        </span>
        <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {userProgress.experience}/{userProgress.experienceToNext}
        </span>
      </div>
      
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-sm font-bold text-primary"
          >
            Level Up! 🎉
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};