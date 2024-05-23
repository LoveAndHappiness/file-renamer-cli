const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');

// Helper function to handle timeout
function withTimeout(promise, ms) {
    const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), ms)
    );
    return Promise.race([promise, timeout]);
}

async function extractTextFromPDF(pdfPath, timeoutMs = 10000) {
    const dataBuffer = await fs.readFile(pdfPath);
    try {
        const data = await withTimeout(pdfParse(dataBuffer), timeoutMs);
        const text = data.text;
        console.log(`Extracted text from ${path.basename(pdfPath)}:`, text.substring(0, 2000));
        return text;
    } catch (error) {
        console.error(`Error extracting text from ${pdfPath}:`, error);
        return '';
    }
}

module.exports = { extractTextFromPDF };
