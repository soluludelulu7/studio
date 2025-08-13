
'use client';

import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { downloadSvg } from '@/lib/utils';
import { Award, Download } from 'lucide-react';
import Link from 'next/link';

export function Certificate() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [name, setName] = useState('Awesome Learner');

  const handleDownload = () => {
    if (svgRef.current) {
      downloadSvg(svgRef.current, 'CodeStart20-Certificate.svg');
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 p-4 md:p-8 bg-background rounded-lg shadow-2xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary font-headline">Certificate of Completion</h1>
        <p className="text-muted-foreground mt-2">This certificate is awarded to</p>
      </div>

      <div className="w-full max-w-lg bg-card border-2 border-primary/20 rounded-lg shadow-lg p-4">
        <svg ref={svgRef} viewBox="0 0 800 600" className="w-full">
          {/* Background */}
          <rect width="800" height="600" fill="hsl(var(--card))" />
          {/* Border */}
          <rect x="20" y="20" width="760" height="560" fill="none" stroke="hsl(var(--primary))" strokeWidth="10" />
          <rect x="30" y="30" width="740" height="540" fill="none" stroke="hsl(var(--accent))" strokeWidth="3" />

          {/* Content */}
          <text x="400" y="120" fontFamily="PT Sans, sans-serif" fontSize="48" fontWeight="bold" textAnchor="middle" fill="hsl(var(--primary))">
            Certificate of Completion
          </text>
          <text x="400" y="180" fontFamily="PT Sans, sans-serif" fontSize="24" textAnchor="middle" fill="hsl(var(--foreground))">
            This certifies that
          </text>

          <text x="400" y="280" fontFamily="PT Sans, sans-serif" fontSize="40" fontWeight="bold" textAnchor="middle" fill="hsl(var(--accent-foreground))" className="font-headline">
            {name || 'Awesome Learner'}
          </text>
          <line x1="150" y1="310" x2="650" y2="310" stroke="hsl(var(--accent))" strokeWidth="2" />

          <text x="400" y="360" fontFamily="PT Sans, sans-serif" fontSize="24" textAnchor="middle" fill="hsl(var(--foreground))">
            has successfully completed the
          </text>
          <text x="400" y="410" fontFamily="PT Sans, sans-serif" fontSize="32" fontWeight="bold" textAnchor="middle" fill="hsl(var(--primary))">
            CodeStart20: Intro to Python
          </text>
          <text x="400" y="450" fontFamily="PT Sans, sans-serif" fontSize="24" textAnchor="middle" fill="hsl(var(--foreground))">
            course.
          </text>

          
        </svg>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <Input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-center text-lg"
          aria-label="Your name for the certificate"
        />
        <Button onClick={handleDownload} className="w-full" size="lg">
          <Download className="mr-2 h-5 w-5" />
          Download Certificate
        </Button>
         <Button variant="outline" className="w-full" asChild>
            <Link href="/lessons">Back to Lesson Map</Link>
        </Button>
      </div>
    </div>
  );
}
