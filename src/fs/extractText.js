const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');

async function extractTextFromPDF(pdfPath) {
    const dataBuffer = await fs.readFile(pdfPath);
    try {
        const data = await pdfParse(dataBuffer);
        const text = data.text.substring(0,4000);
        return text;
    } catch (error) {
        console.error(`Error extracting text from ${pdfPath}:`, error);
        return '';
    }
}

module.exports = { extractTextFromPDF };