
export interface Experience {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}

export interface Education {
    degree: string;
    institution: string;
    location: string;
    graduationDate: string;
}

export interface ResumeData {
  id: string;
  jobTarget: string; 
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    portfolio?: string;
  };
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: {
    technical: string[];
    soft: string[];
  };
}

export interface CoverLetterData {
    content: string;
}

export interface GeneratedDocument {
    resume: ResumeData;
    coverLetter: CoverLetterData;
    createdAt: string;
}
