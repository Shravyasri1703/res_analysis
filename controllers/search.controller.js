// src/controllers/searchController.js
import Applicant from '../models/applicants.model.js';
import { decrypt } from '../services/encryption.service.js';

export const searchResumes = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name search parameter is required" });
    }

    
    const allApplicants = await Applicant.find({});
    
  
    const matchingApplicants = allApplicants.filter(applicant => {
      const decryptedName = decrypt(applicant.name);
      return decryptedName.toLowerCase().includes(name.toLowerCase());
    });

    if (matchingApplicants.length === 0) {
      return res.status(404).json({ error: "No matching resumes found" });
    }

  
    const decryptedResults = matchingApplicants.map(applicant => {
      const appData = applicant.toObject();
      return {
        ...appData,
        name: decrypt(appData.name),
        email: decrypt(appData.email)
      };
    });

    return res.status(200).json(decryptedResults);
  } catch (error) {
    console.error("Resume search error:", error);
    return res.status(500).json({ error: "Failed to search resumes" });
  }
};