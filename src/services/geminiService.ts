import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyC2cSWLgY3_CoheXRTvS1Sx1WIME9pYZPc';

const genAI = new GoogleGenerativeAI(apiKey);

import { JobDescription } from '@/types/job';

export class GeminiService {
  async extractJobDescription(text: string): Promise<JobDescription> {
    if (!apiKey) {
      // Return mock data if API key is not set - simulate extraction from text
      const mockTitles = ['Senior Python Developer', 'Full Stack Engineer', 'Frontend Developer', 'Backend Engineer'];
      const mockSkills = ['Python', 'Django', 'PostgreSQL', 'React', 'TypeScript', 'Node.js', 'MongoDB', 'AWS'];
      const mockSeniority = ['Junior', 'Mid', 'Senior'];

      // Simple keyword extraction simulation
      const lowerText = text.toLowerCase();
      const extractedSkills = mockSkills.filter(skill => lowerText.includes(skill.toLowerCase()));

      return {
        title: mockTitles[Math.floor(Math.random() * mockTitles.length)],
        skills: extractedSkills.length > 0 ? extractedSkills : ['Python', 'Django'],
        seniority: lowerText.includes('senior') ? 'Senior' : lowerText.includes('junior') ? 'Junior' : 'Mid',
        salary: lowerText.includes('$') ? '$120,000 - $150,000' : undefined,
        location: lowerText.includes('remote') ? 'Remote' : undefined,
        experience: lowerText.includes('year') ? '5+ years' : undefined,
      };
    }

    try {
      const prompt = `You are a job description extraction assistant. Extract structured job information from the following conversation or text.

Extract the following information:
1. Job Title - The specific role title (e.g., "Senior Python Developer", "Full Stack Engineer")
2. Skills - Array of technical skills, programming languages, frameworks, or tools mentioned
3. Seniority Level - One of: "Junior", "Mid", or "Senior" based on experience requirements
4. Salary Range - If mentioned, include the salary range
5. Location - If mentioned, include the location (e.g., "Remote", "San Francisco, CA")
6. Experience - If mentioned, include the experience requirement (e.g., "5+ years")

Conversation/Text:
${text}

Return ONLY a valid JSON object in this exact format (no markdown, no code blocks):
{
  "title": "Job Title",
  "skills": ["skill1", "skill2", "skill3"],
  "seniority": "Junior|Mid|Senior",
  "salary": "salary range if mentioned",
  "location": "location if mentioned",
  "experience": "experience requirement if mentioned"
}

If information is not available, omit that field or use null.`;

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      let jobDescription;

      try {
        // Try to parse JSON directly
        jobDescription = JSON.parse(content);
      } catch (parseError) {
        // If parsing fails, try to extract JSON from markdown code blocks
        const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/) || content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jobDescription = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          throw new Error('Could not parse JSON response');
        }
      }

      return {
        title: jobDescription.title || 'Software Engineer',
        skills: Array.isArray(jobDescription.skills) ? jobDescription.skills : [],
        seniority: jobDescription.seniority || 'Mid',
        salary: jobDescription.salary || undefined,
        location: jobDescription.location || undefined,
        experience: jobDescription.experience || undefined,
      };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      // Return default structure on error
      return {
        title: 'Software Engineer',
        skills: [],
        seniority: 'Mid',
      };
    }
  }
}

export const geminiService = new GeminiService();
