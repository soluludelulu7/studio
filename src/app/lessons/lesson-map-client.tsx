
'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, Lock, PlayCircle, Star } from 'lucide-react';
import type { Lesson } from '@/lib/types';
import { useProgress } from '@/hooks/use-progress';
import { TOTAL_LESSONS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonMapClient({ lessons }: { lessons: Lesson[] }) {
  const { completedLessons, isLoaded } = useProgress();
  const nextLessonId = completedLessons.length + 1;

  if (!isLoaded) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: TOTAL_LESSONS }).map((_, i) => (
                <Card key={i}>
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id);
        const isCurrent = lesson.id === nextLessonId;
        const isLocked = lesson.id > nextLessonId;
        const isCertificate = lesson.id === TOTAL_LESSONS;

        const getStatusIcon = () => {
          if (isCertificate && isCompleted) return <Star className="text-yellow-500" />;
          if (isCompleted) return <CheckCircle2 className="text-green-500" />;
          if (isCurrent) return <PlayCircle className="text-accent" />;
          return <Lock className="text-muted-foreground/50" />;
        };

        return (
          <Link key={lesson.id} href={isLocked ? '#' : `/lessons/${lesson.id}`} aria-disabled={isLocked}>
            <Card
              className={cn(
                'h-full transition-all hover:shadow-md hover:-translate-y-1',
                isLocked ? 'bg-muted/50 cursor-not-allowed' : 'bg-card',
                isCurrent && 'border-accent shadow-lg',
                isCertificate && isCompleted && 'border-yellow-500 bg-yellow-50'
              )}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">{lesson.title}</CardTitle>
                  {getStatusIcon()}
                </div>
                <CardDescription>{lesson.objective}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
