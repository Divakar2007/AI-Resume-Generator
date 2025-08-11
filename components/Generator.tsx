import React, { useState, useEffect, useCallback } from 'react';
import type { GeneratedDocument } from '../types';
import { generateResumeAndCoverLetter } from '../services/geminiService';
import { ResumePreview } from './ResumePreview';
import { CoverLetterPreview } from './CoverLetterPreview';
import { SparklesIcon, ArrowDownTrayIcon, PlusIcon, DocumentIcon } from './icons';

// @ts-ignore
const { jsPDF } = window.jspdf;
// @ts-ignore
const html2canvas = window.html2canvas;

interface GeneratorProps {
  onDocumentGenerated: (doc: GeneratedDocument) => void;
  activeDocument: GeneratedDocument | null;
  onCreateNew: () => void;
}

export const Generator: React.FC<GeneratorProps> = ({ onDocumentGenerated, activeDocument, onCreateNew }) => {
  const [jobTarget, setJobTarget] = useState('');
  const [experience, setExperience] = useState('');
  const [skills, setSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDocument | null>(null);

  useEffect(() => {
    if (activeDocument) {
      setGeneratedDoc(activeDocument);
      // We don't populate the form fields from the saved doc
      // to encourage generating new ones, but we show the result.
      setJobTarget('');
      setExperience('');
      setSkills('');
    } else {
      setGeneratedDoc(null);
    }
  }, [activeDocument]);

  const handleGenerate = async () => {
    if (!jobTarget || !experience || !skills) {
      setError("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedDoc(null);

    try {
      const doc = await generateResumeAndCoverLetter(jobTarget, experience, skills);
      setGeneratedDoc(doc);
      onDocumentGenerated(doc);
    } catch (e: any) {
      console.error(e);
      setError("Failed to generate document. Please check your API Key and try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownloadPdf = useCallback(() => {
    const resumeElement = document.getElementById('resume-preview');
    if (!resumeElement) {
        console.error("Resume preview element not found!");
        return;
    }
    
    // Temporarily increase resolution for better quality PDF
    const scale = 2;
    html2canvas(resumeElement, {
        scale: scale,
        useCORS: true,
        backgroundColor: '#ffffff' // Ensure background is white for PDF
    }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${generatedDoc?.resume?.personalInfo?.name.replace(' ', '_')}_Resume.pdf` || 'resume.pdf');
    });
  }, [generatedDoc]);

  const handleLocalCreateNew = () => {
    setGeneratedDoc(null);
    setJobTarget('');
    setExperience('');
    setSkills('');
    setError(null);
    onCreateNew();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form Column */}
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-white">Create Your Documents</h2>
            <button onClick={handleLocalCreateNew} className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                <PlusIcon className="h-5 w-5" />
                <span>New</span>
            </button>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-lg shadow-lg space-y-4">
          <div>
            <label htmlFor="job-target" className="block text-sm font-medium text-slate-300 mb-1">Job Target</label>
            <input type="text" id="job-target" value={jobTarget} onChange={e => setJobTarget(e.target.value)} placeholder="e.g., Senior Frontend Developer" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-slate-300 mb-1">Experience</label>
            <textarea id="experience" value={experience} onChange={e => setExperience(e.target.value)} rows={8} placeholder="Paste your job history here. Include job titles, companies, and responsibilities." className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-slate-300 mb-1">Skills</label>
            <textarea id="skills" value={skills} onChange={e => setSkills(e.target.value)} rows={4} placeholder="List your skills, separated by commas. e.g., React, TypeScript, Figma, Project Management" className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed">
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-5 w-5 mr-2" />
                Generate
              </>
            )}
          </button>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </div>
      </div>

      {/* Output Column */}
      <div className="flex flex-col space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full bg-slate-800 rounded-lg p-8">
            <SparklesIcon className="h-16 w-16 text-indigo-400 animate-pulse" />
            <p className="mt-4 text-lg text-slate-300">Architecting your career documents...</p>
            <p className="text-sm text-slate-400">This may take a moment.</p>
          </div>
        )}
        
        {!isLoading && !generatedDoc && (
          <div className="flex flex-col items-center justify-center h-full bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg p-8">
            <DocumentIcon className="h-16 w-16 text-slate-600" />
            <p className="mt-4 text-lg text-slate-400">Your generated documents will appear here.</p>
          </div>
        )}

        {generatedDoc && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-white">Your Documents</h2>
               <button onClick={handleDownloadPdf} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                 <ArrowDownTrayIcon className="h-5 w-5" />
                 <span>Download PDF</span>
               </button>
            </div>
            
            {/* Tabs */}
            <div x-data="{ tab: 'resume' }" className="bg-slate-800 p-2 rounded-lg">
                <nav className="flex space-x-2" aria-label="Tabs">
                    <button onClick={() => document.getElementById('resume-content')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-100 bg-slate-700 px-3 py-2 font-medium text-sm rounded-md">Resume</button>
                    <button onClick={() => document.getElementById('cover-letter-content')?.scrollIntoView({ behavior: 'smooth' })} className="text-slate-300 hover:text-white px-3 py-2 font-medium text-sm rounded-md">Cover Letter</button>
                </nav>
            </div>

            <div className="max-h-[calc(100vh-250px)] overflow-y-auto space-y-6 rounded-lg p-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
              <div id="resume-content">
                <h3 className="text-xl font-semibold text-white mb-2">Resume</h3>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <ResumePreview resume={generatedDoc.resume} />
                </div>
              </div>
              <div id="cover-letter-content">
                <h3 className="text-xl font-semibold text-white mb-2">Cover Letter</h3>
                <div className="bg-slate-800 p-6 rounded-lg shadow-lg">
                  <CoverLetterPreview coverLetter={generatedDoc.coverLetter} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};