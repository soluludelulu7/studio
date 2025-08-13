
'use client';

import { useState } from 'react';
import type { Quiz as QuizType, QuizQuestion } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle } from 'lucide-react';

interface QuizProps {
  quiz: QuizType;
  onSuccess: () => void;
}

export function Quiz({ quiz, onSuccess }: QuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isQuizFinished = currentQuestionIndex >= quiz.questions.length;

  const handleSubmit = () => {
    if (selectedAnswer === currentQuestion.answer) {
      setFeedback('correct');
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
        if (currentQuestionIndex === quiz.questions.length - 1) {
          onSuccess();
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 1500);
    } else {
      setFeedback('incorrect');
    }
  };
  
  if (isQuizFinished) {
      return (
        <Card className="bg-green-100 dark:bg-green-900/50 border-green-500">
            <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-300">Quiz Completed!</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-green-700 dark:text-green-400">Great job! You've passed the quiz.</p>
            </CardContent>
        </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz: Question {currentQuestionIndex + 1} of {quiz.questions.length}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="font-semibold">{currentQuestion.question}</p>
        <RadioGroup onValueChange={setSelectedAnswer} value={selectedAnswer || ''}>
          {currentQuestion.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option} className="font-normal">{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {feedback && (
          <Alert variant={feedback === 'correct' ? 'default' : 'destructive'} className={feedback === 'correct' ? 'bg-green-100 dark:bg-green-900/50 border-green-500' : ''}>
            {feedback === 'correct' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            <AlertTitle>{feedback === 'correct' ? 'Correct!' : 'Not Quite'}</AlertTitle>
            <AlertDescription>
              {feedback === 'correct' ? 'Great job!' : 'Try again. You got this!'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={!selectedAnswer || feedback === 'correct'}>
          Submit Answer
        </Button>
      </CardFooter>
    </Card>
  );
}
