
import React, { useState, useCallback } from 'react';
import { Generator } from './components/Generator';
import { Dashboard } from './components/Dashboard';
import { DocumentIcon, ListBulletIcon } from './components/icons';
import type { GeneratedDocument } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'generator' | 'dashboard';

const App: React.FC = () => {
  const [view, setView] = useState<View>('generator');
  const [savedDocuments, setSavedDocuments] = useLocalStorage<GeneratedDocument[]>('ai-resume-docs', []);
  const [activeDocument, setActiveDocument] = useState<GeneratedDocument | null>(null);

  const handleDocumentGenerated = useCallback((doc: GeneratedDocument) => {
    setSavedDocuments(prevDocs => [doc, ...prevDocs]);
    setActiveDocument(doc);
  }, [setSavedDocuments]);

  const handleSelectDocument = useCallback((doc: GeneratedDocument) => {
    setActiveDocument(doc);
    setView('generator');
  }, []);

  const handleCreateNew = useCallback(() => {
    setActiveDocument(null);
    setView('generator');
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <header className="bg-slate-900/80 backdrop-blur-sm sticky top-0 z-20 border-b border-slate-700">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <DocumentIcon className="h-8 w-8 text-indigo-400" />
              <h1 className="text-xl font-bold tracking-tight text-slate-100">AI Resume Architect</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => setView('generator')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'generator' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <DocumentIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Generator</span>
              </button>
              <button
                onClick={() => setView('dashboard')}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  view === 'dashboard' ? 'bg-indigo-500 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'generator' && (
          <Generator 
            onDocumentGenerated={handleDocumentGenerated}
            activeDocument={activeDocument}
            onCreateNew={handleCreateNew}
          />
        )}
        {view === 'dashboard' && (
          <Dashboard 
            documents={savedDocuments} 
            onSelectDocument={handleSelectDocument}
            onCreateNew={handleCreateNew}
          />
        )}
      </main>
    </div>
  );
};

export default App;
