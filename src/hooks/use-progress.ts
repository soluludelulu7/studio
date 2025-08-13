
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Badge } from '@/lib/types';
import { Award, BookCheck, Star } from 'lucide-react';

const PROGRESS_KEY = 'codestart20_progress';

export const BADGES: Badge[] = [
  { id: 'lesson-5', name: 'First Milestone', description: 'Completed Lesson 5!', icon: Star },
  { id: 'lesson-10', name: 'Halfway There', description: 'Completed Lesson 10!', icon: BookCheck },
  { id: 'lesson-20', name: 'Python Pro', description: 'Completed Lesson 20!', icon: Award },
];

interface Progress {
  completedLessons: number[];
  coins: number;
  badges: string[];
}

const getInitialProgress = (): Progress => {
  if (typeof window === 'undefined') {
    return { completedLessons: [], coins: 0, badges: [] };
  }
  try {
    const item = window.localStorage.getItem(PROGRESS_KEY);
    return item ? JSON.parse(item) : { completedLessons: [], coins: 0, badges: [] };
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return { completedLessons: [], coins: 0, badges: [] };
  }
};

export function useProgress() {
  const [progress, setProgress] = useState<Progress>({ completedLessons: [], coins: 0, badges: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setProgress(getInitialProgress());
    setIsLoaded(true);
  }, []);

  const updateProgress = useCallback((newProgress: Partial<Progress>) => {
    try {
      const updated = { ...progress, ...newProgress };
      setProgress(updated);
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving to localStorage', error);
    }
  }, [progress]);

  const completeLesson = useCallback((lessonId: number) => {
    if (progress.completedLessons.includes(lessonId)) return;

    const newCompletedLessons = [...progress.completedLessons, lessonId];
    const newCoins = progress.coins + 10;
    
    let newBadges = [...progress.badges];
    if (lessonId === 5 && !newBadges.includes('lesson-5')) newBadges.push('lesson-5');
    if (lessonId === 10 && !newBadges.includes('lesson-10')) newBadges.push('lesson-10');
    if (lessonId === 20 && !newBadges.includes('lesson-20')) newBadges.push('lesson-20');

    updateProgress({ 
      completedLessons: newCompletedLessons, 
      coins: newCoins,
      badges: newBadges,
    });
  }, [progress, updateProgress]);
  
  const earnedBadges = BADGES.filter(b => progress.badges.includes(b.id));

  return { ...progress, earnedBadges, completeLesson, isLoaded };
}
