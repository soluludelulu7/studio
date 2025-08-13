
import fs from 'fs/promises';
import path from 'path';
import type { Lesson } from '@/lib/types';
import LessonView from './lesson-view';
import { notFound } from 'next/navigation';
import { TOTAL_LESSONS } from '@/lib/constants';

async function getLessons(): Promise<Lesson[]> {
  const filePath = path.join(process.cwd(), 'public/assets/lessons.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export async function generateStaticParams() {
    return Array.from({ length: TOTAL_LESSONS }, (_, i) => ({
      id: (i + 1).toString(),
    }))
}

export default async function LessonPage({ params }: { params: { id: string } }) {
  const lessons = await getLessons();
  const lesson = lessons.find((l) => l.id.toString() === params.id);

  if (!lesson) {
    notFound();
  }

  return <LessonView lesson={lesson} lessons={lessons} />;
}
