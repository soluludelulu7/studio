
export interface Lesson {
  id: number;
  title: string;
  objective: string;
  explanation: string;
  examples: { code: string }[];
  activity: Activity | null;
  quiz: Quiz | null;
}

export interface Activity {
  description: string;
  placeholderCode: string;
  expectedOutput: string;
  inputs?: string[];
  isCommentOnly?: boolean;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}
