// src/fs/index.js

const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const { getFileData } = require('../openai/api');

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

            // Extract text from PDF files
            console.log('Extracting text from PDF...');

            const dataBuffer = await fs.readFile(originalPath);
            let text; // Define text variable to store extracted text
            try {
                const data = await pdfParse(dataBuffer);
                // Consider using only the text from the first 1-2 pages if applicable
                text = data.text.substring(0, 2000); // Assign a value to text here
                console.log(`Extracted text from ${path.basename(originalPath)}:`, text.substring(0, 4000));
            } catch (error) {
                console.error(`Error extracting text from ${originalPath}:`, error);
                continue;
            }

            // Ensure extracted text is valid
            if (!text) {
                console.error(`No text extracted from ${originalPath}. Skipping file.`);
                continue;
            }

            // Verify text length and content
            console.log(`Length of extracted text: ${text.length}`);
            console.log(`Content of extracted text: ${text}`);

            // Get new filename from OpenAI API
            console.log('Making request to OpenAI API...');

            let fileData;
            try {
                fileData = await getFileData({ fileContent: text});
                fileData = JSON.parse(fileData);
                console.log(`File data received: ${JSON.stringify(fileData)}`);
            } catch (error) {
                console.error(`Error getting file data from OpenAI API for ${file}:`, error);
                continue;
            }

            // Check if the required fields are present in the response
            const { date, sender, summary, object_name: objectName, category } = fileData;
            if (!date || !sender || !summary || !objectName || !category) {
                console.error(`Incomplete data received from OpenAI API for ${file}:`, fileData);
                continue;
            }

            // Construct the new filename
            const newFileName = `${date} - ${sender} - ${summary} - ${objectName}${path.extname(originalPath)}`;

            console.log('Response received from OpenAI API.');
            console.log(`New Filename generated: ${newFileName}`);

            // Actually renaming the file
            const newFilePath = path.join(processedDir, newFileName);
            try {
                // await fs.rename(originalPath, newFilePath);
                console.log(`${file} has been processed and moved to ${newFilePath}.`);
            } catch (error) {
                console.error(`Error renaming file ${originalPath} to ${newFilePath}:`, error);
            }
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
        const text = data.text; // You might want to trim or process the text further
        console.log(`Extracted text from ${path.basename(pdfPath)}:`, text.substring(0, 2000));
        return text;
    } catch (error) {
        console.error(`Error extracting text from ${pdfPath}:`, error);
        return '';
    }
}

// Export the function for use in other parts of your application
module.exports = { processFiles, extractTextFromPDF };
