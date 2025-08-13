
import fs from 'fs/promises';
import path from 'path';
import type { Lesson } from '@/lib/types';
import LessonMapClient from './lesson-map-client';

async function getLessons(): Promise<Lesson[]> {
  const filePath = path.join(process.cwd(), 'public/assets/lessons.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export default async function LessonMapPage() {
  const lessons = await getLessons();

  return (
    <main className="container mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold font-headline text-primary">Lesson Map</h1>
        <p className="text-muted-foreground mt-2">Choose a lesson to begin your journey.</p>
      </div>
      <LessonMapClient lessons={lessons} />
    </main>
  );
}
