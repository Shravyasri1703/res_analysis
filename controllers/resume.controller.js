import { extractTextFromPdf } from '../services/pdf.service.js';
import { processResumeText } from '../services/gemini.service.js';
import { encrypt } from '../services/encryption.service.js';
import Applicant from '../models/applicants.model.js';

export const processResume = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: "PDF URL is required" });
        }

        if (!url.toLowerCase().endsWith('.pdf')) {
            return res.status(400).json({ error: "URL must point to a PDF file" });
        }
        let extractedText;
        try {
            extractedText = await extractTextFromPdf(url);

            if (!extractedText || extractedText.trim() === '') {
                return res.status(500).json({
                    error: "No text content detected in the PDF file"
                });
            }

            console.log("Successfully extracted text from PDF");
        } catch (pdfError) {
            console.error("PDF processing error:", pdfError);
            return res.status(500).json({
                error: "Failed to process PDF file. Please ensure it's a valid PDF."
            });
        }

        const cleanedText = extractedText
            .replace(/\s+/g, ' ')           
            .replace(/\n+/g, '\n')          
            .replace(/[^\w\s@.+-]/g, ' ')   
            .trim();                        

        console.log("Text length extracted:", cleanedText.length);
        console.log("Text sample:", cleanedText.substring(0, 500) + "...");

    
        let resumeData;
        try {
            resumeData = await processResumeText(extractedText);
            console.log("Successfully processed resume with LLM");
            console.log("Extracted data:", JSON.stringify(resumeData, null, 2));
        } catch (llmError) {
            console.error("LLM processing error:", llmError);
            return res.status(500).json({
                error: "Failed to extract structured data from resume"
            });
        }



    
        try {
            const encryptedData = {
                ...resumeData,
                name: encrypt(resumeData.name),
                email: encrypt(resumeData.email)
            };

    
            console.log("Saving to database:", JSON.stringify({
                ...encryptedData,
                name: "[ENCRYPTED]",
                email: "[ENCRYPTED]"
            }, null, 2));

            
            if (!encryptedData.education || typeof encryptedData.education !== 'object') {
                throw new Error("Invalid education structure");
            }
            if (!encryptedData.experience || typeof encryptedData.experience !== 'object') {
                throw new Error("Invalid experience structure");
            }

            const newApplicant = new Applicant(encryptedData);
            await newApplicant.save();

            return res.status(200).json({
                message: "Resume processed successfully",
                applicantId: newApplicant._id
            });
        } catch (dbError) {
            console.error("Database error:", dbError);

        
            if (dbError.name === 'ValidationError') {
                return res.status(400).json({
                    error: "Resume data validation failed. Please ensure all required fields are present.",
                    details: Object.keys(dbError.errors).map(field => `${field} is required`)
                });
            }

            return res.status(500).json({
                error: "Failed to save resume data to database"
            });
        }
    } catch (err) {
        console.error("Unexpected error in processResume function:", err);
        return res.status(500).json({ error: "An unexpected error occurred" });
    }
};