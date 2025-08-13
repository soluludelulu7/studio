
'use client';

import { useState, useEffect } from 'react';
import type { Lesson } from '@/lib/types';
import { useProgress } from '@/hooks/use-progress';
import { Button } from '@/components/ui/button';
import { CodePlayground } from '@/components/code-playground';
import { Quiz } from '@/components/quiz';
import { useNarration } from '@/hooks/use-narration';
import { Volume2, Square, ArrowRight, ArrowLeft, Award } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { TOTAL_LESSONS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LessonView({ lesson, lessons }: { lesson: Lesson; lessons: Lesson[] }) {
  const { completeLesson, completedLessons, isLoaded } = useProgress();
  const { speak, cancel, speaking } = useNarration();

  const [activityCompleted, setActivityCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const isLessonCompleted = completedLessons.includes(lesson.id);
  const isCertificateLesson = lesson.id === TOTAL_LESSONS;

  useEffect(() => {
    // Automatically mark parts as complete if they don't exist for the lesson
    if (!lesson.activity) {
      setActivityCompleted(true);
    }
    if (!lesson.quiz) {
      setQuizCompleted(true);
    }
    
    // If the lesson is already completed in progress, mark all parts as complete
    if (isLessonCompleted) {
        setActivityCompleted(true);
        setQuizCompleted(true);
    }

  }, [lesson, isLessonCompleted]);

  useEffect(() => {
    if (activityCompleted && quizCompleted && !isLessonCompleted) {
      completeLesson(lesson.id);
    }
  }, [activityCompleted, quizCompleted, isLessonCompleted, lesson.id, completeLesson]);

  if (!isLoaded) {
    return (
        <div className="container mx-auto p-4 max-w-4xl space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-48 w-full" />
            </div>
        </div>
    )
  }

  const nextLesson = lessons.find(l => l.id === lesson.id + 1);
  const prevLesson = lessons.find(l => l.id === lesson.id - 1);

  return (
    <main className="container mx-auto p-4 max-w-4xl space-y-8">
      <header>
        <Badge variant="secondary" className="mb-2">Lesson {lesson.id}</Badge>
        <h1 className="text-4xl font-bold font-headline text-primary">{lesson.title}</h1>
        <p className="text-lg text-muted-foreground mt-2">{lesson.objective}</p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold">Explanation</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => (speaking ? cancel() : speak(lesson.explanation))}
            aria-label={speaking ? 'Stop narration' : 'Start narration'}
          >
            {speaking ? <Square className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
        </div>
        <p className="leading-relaxed whitespace-pre-line">{lesson.explanation}</p>
      </section>

      {lesson.examples.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Examples</h2>
            <Card className="bg-card/50">
                <CardContent className="p-4">
                    <pre className="whitespace-pre-wrap font-code text-sm bg-background p-4 rounded-md">
                        <code>{lesson.examples.map(e => e.code).join('\n\n')}</code>
                    </pre>
                </CardContent>
            </Card>
        </section>
      )}

      {lesson.activity && (
        <section>
          <CodePlayground
            lesson={lesson}
            activity={lesson.activity}
            onSuccess={() => setActivityCompleted(true)}
          />
        </section>
      )}

      {lesson.quiz && (
        <section>
          <Quiz quiz={lesson.quiz} onSuccess={() => setQuizCompleted(true)} />
        </section>
      )}
      
      {isCertificateLesson && (
        <Card className="text-center p-8 bg-green-50 border-green-200">
          <CardHeader>
            <Award className="mx-auto h-16 w-16 text-yellow-500" />
            <CardTitle className="text-2xl mt-4">Claim Your Certificate!</CardTitle>
          </CardHeader>
          <CardContent>
             <Button asChild size="lg">
                <Link href="/certificate">View Certificate</Link>
             </Button>
          </CardContent>
        </Card>
      )}

      <Separator />

      <footer className="flex justify-between items-center">
        {prevLesson ? (
            <Button asChild variant="outline">
                <Link href={`/lessons/${prevLesson.id}`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                </Link>
            </Button>
        ) : <div></div>}
        
        {isLessonCompleted && nextLesson && (
            <Button asChild>
                <Link href={`/lessons/${nextLesson.id}`}>
                    Next Lesson
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        )}
      </footer>
    </main>
  );
}
