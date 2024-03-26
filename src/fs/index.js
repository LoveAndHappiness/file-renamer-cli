// Main file system operations (read, rename, move)

const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const { getNewFileName } = require('../openai/api');

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

            // Extract text from PDF files
            console.log('Extracting text from PDF...');

            const dataBuffer = await fs.readFile(originalPath);
            let text; // Define text variable to store extracted text
            try {
                const data = await pdfParse(dataBuffer);
                // Consider using only the text from the first 1-2 pages if applicable
                text = data.text.substring(0, 2000); // Assign a value to text here
                console.log(`Extracted text from ${path.basename(originalPath)}:`, text.substring(0, 2000));
            } catch (error) {
                console.error(`Error extracting text from ${originalPath}:`, error);
                return '';
}

            // Get new filename from OpenAI API
            console.log('Making response to OpenAI API...');
            let newFileName = await getNewFileName({ fileContent: text });
            newFileName = newFileName.replace(/"/g, ''); // Remove double quotes from filename
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulated delay
            console.log('Response received from OpenAI API.');
            console.log(`New Filename generated: ${newFileName}`);

            // Actually renaming the file
            const newFilePath = path.join(processedDir, `${newFileName}${path.extname(originalPath)}`);
            // Rename the file
            await fs.rename(originalPath, newFilePath);

            console.log(`${file} has been processed and moved to ${newFilePath}.`);
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
        console.log(`Extracted text from ${path.basename(pdfPath)}:`, text.substring(0, 2000));
        return data.text;
    } catch (error) {
        console.error('Error extracting text from ${pdfPath}:', error);
        return '';
    }
}


// Export the function for use in other parts of your application
module.exports = { processFiles, extractTextFromPDF };