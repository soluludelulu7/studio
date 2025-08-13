
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useProgress, BADGES } from '@/hooks/use-progress';
import { ArrowRight, Coins, Map } from 'lucide-react';
import { TOTAL_LESSONS } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function HomePage() {
  const { completedLessons, coins, earnedBadges, isLoaded } = useProgress();

  const progressPercentage = (completedLessons.length / (TOTAL_LESSONS -1)) * 100; // -1 to not count certificate
  const nextLessonId = completedLessons.length + 1;
  const isCourseComplete = completedLessons.length >= TOTAL_LESSONS;

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <>
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex gap-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
            </div>
        </>
      )
    }

    return (
        <>
            <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">
                Welcome to CodeStart20
            </h1>
            <p className="text-muted-foreground mt-2 max-w-prose">
                Your journey to learning Python starts here. Complete 20 lessons to master the basics and earn your certificate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                {isCourseComplete ? (
                     <Button size="lg" asChild>
                        <Link href={`/lessons/${TOTAL_LESSONS}`}>
                            <ArrowRight className="mr-2 h-5 w-5" /> Claim Your Certificate
                        </Link>
                    </Button>
                ) : (
                    <Button size="lg" asChild>
                        <Link href={`/lessons/${nextLessonId}`}>
                            <ArrowRight className="mr-2 h-5 w-5" /> 
                            {completedLessons.length > 0 ? 'Continue Lesson' : 'Start Learning'}
                        </Link>
                    </Button>
                )}
                <Button size="lg" variant="outline" asChild>
                    <Link href="/lessons">
                        <Map className="mr-2 h-5 w-5" /> Lesson Map
                    </Link>
                </Button>
            </div>
        </>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-grid-pattern">
      <div className="container max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="text-center md:text-left">
          
          {renderContent()}
        </div>
        
        <Card className="shadow-2xl">
            <CardHeader>
                <CardTitle>Your Progress</CardTitle>
                <CardDescription>You have completed {completedLessons.length} out of {TOTAL_LESSONS - 1} lessons.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <Progress value={isLoaded ? progressPercentage : 0} />
                </div>
                <div className="flex justify-between items-center text-lg">
                    <div className="flex items-center gap-2 font-semibold">
                        <Coins className="text-yellow-500" />
                        <span>Coins Earned</span>
                    </div>
                    {isLoaded ? <span className="font-bold">{coins}</span> : <Skeleton className="h-6 w-12" />}
                </div>
                <div>
                    <h3 className="font-semibold mb-3">Badges</h3>
                    <div className="flex gap-4">
                        <TooltipProvider>
                        {BADGES.map(badge => {
                            const hasBadge = earnedBadges.some(b => b.id === badge.id);
                            return (
                                <Tooltip key={badge.id}>
                                    <TooltipTrigger>
                                        <div className={`p-3 rounded-full border-2 ${hasBadge ? 'bg-accent/30 border-accent' : 'bg-muted/50'}`}>
                                            <badge.icon className={`h-8 w-8 ${hasBadge ? 'text-accent' : 'text-muted-foreground'}`} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-semibold">{badge.name}</p>
                                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                                        {!hasBadge && <p className="text-xs text-red-500">(Not earned yet)</p>}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>

      </div>
    </main>
  );
}
