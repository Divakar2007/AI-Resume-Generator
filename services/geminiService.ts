
import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedDocument, ResumeData, CoverLetterData } from '../types';

declare global {
    interface Window {
        uuid: {
            v4: () => string;
        }
    }
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        personalInfo: {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING, description: "The user's full name. Default to 'Alex Doe' if not specified." },
                email: { type: Type.STRING, description: "The user's email address. Default to 'alex.doe@email.com'." },
                phone: { type: Type.STRING, description: "The user's phone number. Default to '123-456-7890'." },
                linkedin: { type: Type.STRING, description: "URL to the user's LinkedIn profile. Omit if not provided." },
                portfolio: { type: Type.STRING, description: "URL to the user's portfolio website. Omit if not provided." },
            },
            required: ["name", "email", "phone"]
        },
        summary: {
            type: Type.STRING,
            description: "A compelling 3-4 sentence professional summary tailored to the job target."
        },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    jobTitle: { type: Type.STRING },
                    company: { type: Type.STRING },
                    location: { type: Type.STRING },
                    startDate: { type: Type.STRING, description: "e.g., 'Jan 2020'" },
                    endDate: { type: Type.STRING, description: "e.g., 'Present' or 'Dec 2022'" },
                    description: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "Bulleted list of 3-5 key achievements and responsibilities, starting with action verbs."
                    }
                },
                 required: ["jobTitle", "company", "location", "startDate", "endDate", "description"]
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    location: { type: Type.STRING },
                    graduationDate: { type: Type.STRING }
                },
                 required: ["institution", "degree", "location", "graduationDate"]
            }
        },
        skills: {
            type: Type.OBJECT,
            properties: {
                technical: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of technical skills (e.g., programming languages, software)." },
                soft: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of soft skills (e.g., communication, leadership)." },
            },
            required: ["technical", "soft"]
        }
    },
    required: ["personalInfo", "summary", "experience", "education", "skills"]
};


export const generateResumeAndCoverLetter = async (
  jobTarget: string,
  experience: string,
  skills: string
): Promise<GeneratedDocument> => {
  const resumePrompt = `
    You are an expert resume writer and career advisor. Generate a professional resume in JSON format based on the following details.
    The user's name is Alex Doe, email is alex.doe@email.com, and phone is 123-456-7890. You can invent a LinkedIn profile URL.
    Carefully parse the 'Experience' text into distinct job roles with achievements.
    Categorize the provided skills into 'technical' and 'soft'.
    Create a powerful, concise professional summary tailored for the job target.
    Invent one relevant education entry.

    Job Target: "${jobTarget}"
    Experience: "${experience}"
    Skills: "${skills}"
  `;

  const coverLetterPrompt = `
    You are a professional career coach. Write a compelling, modern, and tailored cover letter for the following job target, based on the user's experience and skills.
    The cover letter should be addressed to the 'Hiring Manager'. It should be professional yet personable.
    Highlight how the user's skills and experience directly align with the job target.
    Keep it concise, around 3-4 paragraphs. Use the name Alex Doe.

    Job Target: "${jobTarget}"
    Experience: "${experience}"
    Skills: "${skills}"
  `;

  const [resumeResponse, coverLetterResponse] = await Promise.all([
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: resumePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: resumeSchema,
      },
    }),
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: coverLetterPrompt,
    }),
  ]);
  
  const resumeJsonText = resumeResponse.text.trim();
  const resumeData = JSON.parse(resumeJsonText);

  const finalResume: ResumeData = {
    ...resumeData,
    id: window.uuid.v4(),
    jobTarget: jobTarget,
  };

  const coverLetterData: CoverLetterData = {
      content: coverLetterResponse.text
  };

  return {
      resume: finalResume,
      coverLetter: coverLetterData,
      createdAt: new Date().toISOString()
  };
};
