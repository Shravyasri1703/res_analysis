import axios from 'axios';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';  // Import directly from the library path

export const extractTextFromPdf = async (pdfUrl) => {
  try {
    // Fetch the PDF from the URL
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer'
    });
    
    // Parse the PDF content
    const data = await pdfParse(response.data);
    
    // Return the extracted text
    return data.text;
  } catch (error) {
    console.error("PDF extraction error:", error);
    throw new Error(`Failed to extract text from PDF: ${error.message}`);
  }
};