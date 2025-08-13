
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, Play, Terminal, Loader2 } from 'lucide-react';
import type { Activity, Lesson } from '@/lib/types';
import { executePython } from '@/lib/python-executor';
import { getCodeHint } from '@/ai/flows/code-hint-system';
import { useToast } from '@/hooks/use-toast';

interface CodePlaygroundProps {
  activity: Activity;
  lesson: Lesson;
  onSuccess: () => void;
}

export function CodePlayground({ activity, lesson, onSuccess }: CodePlaygroundProps) {
  const [code, setCode] = useState(activity.placeholderCode);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const { toast } = useToast();

  const handleRunCode = async () => {
    setIsLoading(true);
    setError('');
    setOutput('');
    const result = await executePython(code, activity);
    setOutput(result.output);
    if (result.success) {
      onSuccess();
    } else {
      setError(result.error || 'Something went wrong. Try getting a hint!');
    }
    setIsLoading(false);
  };
  
  const handleGetHint = async () => {
    setIsHintLoading(true);
    try {
      const hintResult = await getCodeHint({
        code,
        expectedOutput: activity.expectedOutput,
        lessonContent: `${lesson.title}: ${lesson.explanation}`,
      });
      toast({
        title: '💡 AI Hint',
        description: hintResult.hint,
      });
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Error getting hint',
        description: 'Could not connect to the AI service. Please try again later.',
      });
    } finally {
      setIsHintLoading(false);
    }
  };

  return (
    <Card className="bg-card/50">
      <CardHeader>
        <CardTitle>Interactive Playground</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{activity.description}</p>
        <div className="font-code">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Your Python code here..."
            className="h-48 bg-background"
            aria-label="Code Editor"
          />
        </div>
        {(output || error) && (
          <Alert variant={error ? 'destructive' : 'default'}>
            <Terminal className="h-4 w-4" />
            <AlertTitle>{error ? 'Error' : 'Output'}</AlertTitle>
            <AlertDescription>
              <pre className="whitespace-pre-wrap font-code text-sm">
                {error || output}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleGetHint} disabled={isHintLoading}>
           {isHintLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lightbulb className="mr-2 h-4 w-4" />}
          Get Hint
        </Button>
        <Button onClick={handleRunCode} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          Run Code
        </Button>
      </CardFooter>
    </Card>
  );
}
