const path = require('path');
const fs = require('fs').promises;
const { getFileData } = require('../openai/api');
const { extractTextFromPDF } = require('./extractText');
const { loadProperties } = require('./loadproperties'); // Fixed casing to match file system

// Path to the 'files' directory from 'src/fs/index.js'
const filesDir = path.join(__dirname, '../../files');
const processedDir = path.join(__dirname, '../../processed');

// Ensure directory exists
async function ensureDirectoryExists(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Directory created or already exists: ${dir}`);
    } catch (error) {
        console.error(`Error creating directory ${dir}:`, error);
    }
}

async function processFiles() {
    const properties = await loadProperties();
    if (properties.length === 0) {
        console.error('No properties loaded. Exiting.');
        return;
    }

    try {
        const files = await fs.readdir(filesDir);

        for (const file of files) {
            if (file === 'renamed') continue;

            const originalPath = path.join(filesDir, file);
            console.log(`Processing file: ${file}...`);

            let text;
            try {
                text = await extractTextFromPDF(originalPath);
                console.log(`Extracted text from ${path.basename(originalPath)}:`, text.substring(0, 4000));
            } catch (error) {
                console.error(`Error extracting text from ${originalPath}:`, error);
                continue;
            }

            if (!text) {
                console.error(`No text extracted from ${originalPath}. Skipping file.`);
                continue;
            }

            console.log(`Length of extracted text: ${text.length}`);
            console.log(`Content of extracted text: ${text}`);

            console.log('Making request to OpenAI API...');

            let fileData;
            try {
                fileData = await getFileData({ fileContent: text, properties });
                fileData = JSON.parse(fileData);
                console.log(`File data received: ${JSON.stringify(fileData)}`);
            } catch (error) {
                console.error(`Error getting file data from OpenAI API for ${file}:`, error);
                continue;
            }

            const { date, sender, summary, object_name: objectName, category } = fileData;
            if (!date || !sender || !summary || !objectName || !category) {
                console.error(`Incomplete data received from OpenAI API for ${file}:`, fileData);
                continue;
            }

            const newFileName = `${date} - ${sender} - ${summary} - ${objectName}${path.extname(originalPath)}`;

            console.log('Response received from OpenAI API.');
            console.log(`New Filename generated: ${newFileName}`);

            const propertyDir = path.join('C:/Users/Georg/Nextcloud/Expimo/W1', objectName);  // Adjust the path accordingly
            await ensureDirectoryExists(propertyDir);

            const newFilePath = path.join(propertyDir, newFileName);
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

// Export the function for use in other parts of your application
module.exports = { processFiles };