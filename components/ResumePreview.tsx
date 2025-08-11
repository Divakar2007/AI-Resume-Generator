
import React from 'react';
import type { ResumeData } from '../types';

interface ResumePreviewProps {
  resume: ResumeData;
}

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);
const PhoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 6.75z" />
    </svg>
);
const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.594-11.018-3.714v-2.155z" />
    </svg>
);


export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  return (
    <div id="resume-preview" className="p-8 md:p-12 text-gray-800 font-serif bg-white">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-gray-900">{resume.personalInfo.name}</h1>
        <div className="flex justify-center items-center space-x-4 mt-3 text-sm text-gray-600">
            <a href={`mailto:${resume.personalInfo.email}`} className="flex items-center space-x-1 hover:text-blue-600"><MailIcon className="h-4 w-4"/><span>{resume.personalInfo.email}</span></a>
            <span className="text-gray-300">|</span>
            <span className="flex items-center space-x-1"><PhoneIcon className="h-4 w-4"/><span>{resume.personalInfo.phone}</span></span>
            {resume.personalInfo.linkedin && (
                <>
                <span className="text-gray-300">|</span>
                <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-blue-600"><LinkedinIcon className="h-4 w-4"/><span>LinkedIn</span></a>
                </>
            )}
        </div>
      </header>

      <section>
        <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-4 text-gray-700">Summary</h2>
        <p className="text-base leading-relaxed text-gray-700">{resume.summary}</p>
      </section>
      
      <section className="mt-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-4 text-gray-700">Skills</h2>
        <div className="flex flex-wrap text-sm">
            <strong className="w-full sm:w-1/6 font-semibold text-gray-800">Technical:</strong>
            <p className="w-full sm:w-5/6 text-gray-600">{resume.skills.technical.join(', ')}</p>
        </div>
        <div className="flex flex-wrap text-sm mt-2">
            <strong className="w-full sm:w-1/6 font-semibold text-gray-800">Soft:</strong>
            <p className="w-full sm:w-5/6 text-gray-600">{resume.skills.soft.join(', ')}</p>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-4 text-gray-700">Experience</h2>
        <div className="space-y-6">
          {resume.experience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-baseline">
                <h3 className="text-base font-bold text-gray-800">{exp.jobTitle}</h3>
                <p className="text-sm font-medium text-gray-600">{exp.startDate} - {exp.endDate}</p>
              </div>
              <p className="text-base font-semibold text-gray-700">{exp.company} | {exp.location}</p>
              <ul className="list-disc list-outside pl-5 mt-2 space-y-1 text-sm text-gray-600">
                {exp.description.map((desc, i) => (
                  <li key={i} className="leading-snug">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      
      <section className="mt-8">
        <h2 className="text-lg font-bold uppercase tracking-widest border-b-2 border-gray-300 pb-1 mb-4 text-gray-700">Education</h2>
        {resume.education.map((edu, index) => (
            <div key={index}>
                <div className="flex justify-between items-baseline">
                    <h3 className="text-base font-bold text-gray-800">{edu.institution}</h3>
                    <p className="text-sm font-medium text-gray-600">{edu.graduationDate}</p>
                </div>
                <p className="text-base text-gray-700">{edu.degree} | {edu.location}</p>
            </div>
        ))}
      </section>

    </div>
  );
};
