
import React from 'react';
import type { GeneratedDocument } from '../types';
import { DocumentIcon, PlusIcon } from './icons';

interface DashboardProps {
  documents: GeneratedDocument[];
  onSelectDocument: (doc: GeneratedDocument) => void;
  onCreateNew: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ documents, onSelectDocument, onCreateNew }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <button onClick={onCreateNew} className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
            <PlusIcon className="h-5 w-5" />
            <span>Create New</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-lg">
          <DocumentIcon className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-slate-300">No documents yet</h3>
          <p className="mt-1 text-sm text-slate-400">Generated resumes and cover letters will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.resume.id} 
              onClick={() => onSelectDocument(doc)}
              className="bg-slate-800 rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden border border-slate-700 hover:border-indigo-500"
            >
              <div className="p-5">
                <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">Job Target</p>
                <h3 className="text-lg font-bold text-white truncate">{doc.resume.jobTarget}</h3>
                <p className="text-sm text-slate-400 mt-1">Generated for {doc.resume.personalInfo.name}</p>
              </div>
              <div className="bg-slate-800/50 px-5 py-3 border-t border-slate-700">
                <p className="text-xs text-slate-400">
                  Created on: {new Date(doc.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
