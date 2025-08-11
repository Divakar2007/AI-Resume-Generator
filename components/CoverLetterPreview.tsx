
import React from 'react';
import type { CoverLetterData } from '../types';

interface CoverLetterPreviewProps {
  coverLetter: CoverLetterData;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({ coverLetter }) => {
  return (
    <div className="text-slate-300 prose prose-invert prose-sm max-w-none">
      {coverLetter.content.split('\n').map((paragraph, index) => (
        <p key={index} className="mb-4 last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
};
