// src/services/geminiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const processResumeText = async (resumeText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
Analyze the following resume text and extract structured information in valid JSON format.

Resume Text:
${resumeText}

You MUST return a VALID JSON object with EXACTLY the following structure:
{
  "name": "Candidate Name", 
  "email": "candidate@example.com",
  "education": {
    "degree": "Degree Name",
    "branch": "Field of Study",
    "institution": "University Name",
    "year": "Graduation Year"
  },
  "experience": {
    "job_title": "Most Recent Job Title",
    "company": "Company Name",
    "start_date": "Start Date",
    "end_date": "End Date or Present"
  },
  "skills": ["Skill1", "Skill2", "Skill3"],
  "summary": "Brief professional summary"
}

Important rules:
1. Each field MUST be populated - use "Not specified" if information is missing
2. The structure cannot be altered - education and experience MUST be objects (not arrays)
3. The "skills" field MUST be an array
4. Return ONLY the JSON object without comments, explanations or code blocks

Please extract as much information as possible from the text. If a field is unclear, use "Not specified".
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    
    try {

      let jsonText = responseText;
      
      const jsonRegex = /```(?:json)?\s*(\{[\s\S]*?\})\s*```/;
      const match = responseText.match(jsonRegex);
      if (match) {
        jsonText = match[1];
      } else {
       
        const objectMatch = responseText.match(/(\{[\s\S]*\})/);
        if (objectMatch) {
          jsonText = objectMatch[1];
        }
      }
      
      
      jsonText = jsonText.trim()
        .replace(/[\u201C\u201D]/g, '"') // Replace curly quotes
        .replace(/'/g, '"')              // Replace single quotes with double quotes
        .replace(/\n/g, ' ')             // Remove newlines
        .replace(/,\s*}/g, '}')          // Remove trailing commas
        .replace(/,\s*]/g, ']');         // Remove trailing commas in arrays
      
      
      let parsedData;
      try {
        parsedData = JSON.parse(jsonText);
      } catch (initialError) {
        console.log("Initial parsing failed, attempting cleanup:", initialError.message);
        console.log("Problematic JSON:", jsonText);
        

        const nameMatch = jsonText.match(/"name"\s*:\s*"([^"]+)"/);
        const emailMatch = jsonText.match(/"email"\s*:\s*"([^"]+)"/);
        
        parsedData = {
          name: nameMatch ? nameMatch[1] : "Not specified",
          email: emailMatch ? emailMatch[1] : "Not specified",
          education: {
            degree: "Not specified",
            branch: "Not specified",
            institution: "Not specified",
            year: "Not specified"
          },
          experience: {
            job_title: "Not specified",
            company: "Not specified",
            start_date: "Not specified",
            end_date: "Not specified"
          },
          skills: ["Not specified"],
          summary: "Not specified"
        };
        
        
        try {
          const educationMatch = jsonText.match(/"education"\s*:\s*(\{[^}]+\})/);
          if (educationMatch) {
            const educationObj = JSON.parse(educationMatch[1]
              .replace(/'/g, '"')
              .replace(/([a-zA-Z0-9_]+):/g, '"$1":'));
            parsedData.education = {
              ...parsedData.education,
              ...educationObj
            };
          }
        } catch (e) {
          console.log("Failed to parse education");
        }
        
        
        try {
          const skillsMatch = jsonText.match(/"skills"\s*:\s*(\[[^\]]+\])/);
          if (skillsMatch) {
            const skillsText = skillsMatch[1]
              .replace(/'/g, '"');
            parsedData.skills = JSON.parse(skillsText);
          }
        } catch (e) {
          console.log("Failed to parse skills");
        }
        
        
        const summaryMatch = jsonText.match(/"summary"\s*:\s*"([^"]+)"/);
        if (summaryMatch) {
          parsedData.summary = summaryMatch[1];
        }
      }
      
    
      if (!parsedData.name) parsedData.name = "Not specified";
      if (!parsedData.email) parsedData.email = "Not specified";

      if (!parsedData.education || typeof parsedData.education !== 'object' || Array.isArray(parsedData.education)) {
        parsedData.education = {
          degree: "Not specified",
          branch: "Not specified",
          institution: "Not specified",
          year: "Not specified"
        };
      } else {
        if (!parsedData.education.degree) parsedData.education.degree = "Not specified";
        if (!parsedData.education.branch) parsedData.education.branch = "Not specified";
        if (!parsedData.education.institution) parsedData.education.institution = "Not specified";
        if (!parsedData.education.year) parsedData.education.year = "Not specified";
      }


      if (!parsedData.experience || typeof parsedData.experience !== 'object' || Array.isArray(parsedData.experience)) {
        parsedData.experience = {
          job_title: "Not specified",
          company: "Not specified",
          start_date: "Not specified",
          end_date: "Not specified"
        };
      } else {
        if (!parsedData.experience.job_title) parsedData.experience.job_title = "Not specified";
        if (!parsedData.experience.company) parsedData.experience.company = "Not specified";
        if (!parsedData.experience.start_date) parsedData.experience.start_date = "Not specified";
        if (!parsedData.experience.end_date) parsedData.experience.end_date = "Not specified";
      }


      if (!Array.isArray(parsedData.skills) || parsedData.skills.length === 0) {
        parsedData.skills = ["Not specified"];
      }

      if (!parsedData.summary) parsedData.summary = "Not specified";

      console.log("Final structured data:", JSON.stringify(parsedData, null, 2));
      
      return parsedData;
    } catch (parseError) {
      console.error("Failed to parse LLM response:", parseError);
      console.log("Response text:", responseText);
      throw new Error("Failed to parse structured data from the resume");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    throw new Error(`Failed to process resume with LLM: ${error.message}`);
  }
};