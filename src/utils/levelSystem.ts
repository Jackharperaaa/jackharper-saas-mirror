import { UserProgress } from '@/types';

export const calculateExperienceForLevel = (level: number): number => {
  return level * 100 + (level - 1) * 50; // Progressive XP requirements
};

export const addExperience = (currentProgress: UserProgress, xpGained: number): UserProgress => {
  const newExperience = currentProgress.experience + xpGained;
  let newLevel = currentProgress.level;
  let experienceToNext = currentProgress.experienceToNext - xpGained;

  // Check for level up
  while (experienceToNext <= 0 && newLevel < 100) {
    newLevel++;
    const nextLevelXP = calculateExperienceForLevel(newLevel + 1);
    const currentLevelXP = calculateExperienceForLevel(newLevel);
    experienceToNext = nextLevelXP - newExperience;
  }

  return {
    ...currentProgress,
    level: newLevel,
    experience: newExperience,
    experienceToNext: Math.max(0, experienceToNext),
  };
};

export const getExperienceForTaskListCompletion = (taskCount: number): number => {
  return Math.max(20, taskCount * 5); // Base 20 XP + 5 per task
};