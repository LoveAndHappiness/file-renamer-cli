// Main file system operations (read, rename, move)

const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');

// Path to the 'files' directory from 'src/fs/index.js'
const filesDir = path.join(__dirname, '../../files');
const processedDir = path.join(__dirname, '../../files/renamed');

async function processFiles() {
    try {
        // Read the contents of the 'files' directory
        const files = await fs.readdir(filesDir);

        // Process each file in the 'files' directory
        for (const file of files) {
            // Skip the 'renamed' directory
            if (file === 'renamed') continue;

            // Get the full path to the file
            const originalPath = path.join(filesDir, file);
            const processedPath = path.join(processedDir, file);

            // Simulate file processing (e.g., OCR and renaming the file)
            console.log(`Processing file: ${file}...`);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated delay

            // Move the file to the 'renamed' directory
            await fs.rename(originalPath, processedPath);
            console.log(`${file} has been processed and moved.`);
        }
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

async function extractTextFromPDF(pdfPath) {
    const dataBuffer = await fs.readFile(pdfPath);
    try {
        const data = await pdfParse(dataBuffer);
        // Consider using only the text from the first 1-2 pages if applicable
        const text = data.text; // You might want to trim or process the text furhter
        console.log(`Extracted text from ${path.basename(pdfPath)}:`, text.substring(0, 100));
        return data.text;
    } catch (error) {
        console.error('Error extracting text from ${pdfPath}:', error);
        return '';
    }
}


// Export the function for use in other parts of your application
module.exports = { processFiles, extractTextFromPDF };