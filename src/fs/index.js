const path = require('path');
const fs = require('fs').promises;
const { getFileData } = require('../openai/api');
const { extractTextFromPDF } = require('./extractText');
const { loadProperties } = require('./loadProperties');
const { constructPropertyDir } = require('./constructPropertyDir');

// Load configuration
const config = require('../../config.json');

// Resolve directory paths from the configuration
const filesDir = path.resolve(__dirname, config.filesDir);
const processedDir = path.resolve(__dirname, config.processedDir);
const basePropertyDir = path.resolve(__dirname, config.basePropertyDir);
const backupDir = path.resolve(__dirname, config.backupDir); // Define backup directory

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
    if (!properties.length) {
        console.error('No properties loaded. Exiting.');
        return;
    }

    await ensureDirectoryExists(backupDir); // Ensure backup directory exists

    try {
        const files = await fs.readdir(filesDir);

        for (const file of files) {
            if (file === 'renamed') continue;

            const originalPath = path.join(filesDir, file);
            console.log(`Processing file: ${file}...`);

            let text;
            try {
                text = await extractTextFromPDF(originalPath, 10000); // Set timeout to 10 seconds
                text = text.substring(0, 4000); // Limit the text to the first 4000 characters
                console.log(`Extracted text from ${path.basename(originalPath)}:`, text);
            } catch (error) {
                console.error(`Error extracting text from ${originalPath}:`, error);
                continue;
            }

            if (!text) {
                console.error(`No text extracted from ${originalPath}. Skipping file.`);
                continue;
            }

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

            // Generate a new filename based on the extracted data
            const newFileName = `${date} - ${sender} - ${summary} - ${objectName}${path.extname(originalPath)}`;
            console.log(`New Filename generated: ${newFileName}`);

            // 
            const renamedFilePath = path.join(filesDir, newFileName); // Path for the renamed file in the original directory

            // Rename the file in the original directory
            await fs.rename(originalPath, renamedFilePath);
            const backupPath = path.join(backupDir, newFileName); // Define backup file path

            // Copy the renamed file to the backup directory
            await fs.copyFile(renamedFilePath, backupPath);
            console.log('\n');
            console.log(`Backup created for ${newFileName} at ${backupPath}`);

            const propertyDir = await constructPropertyDir(basePropertyDir, objectName, date, category);
            const newFilePath = path.join(propertyDir, newFileName);
            await fs.rename(renamedFilePath, newFilePath); // Move the renamed file to the new directory
            console.log(`${newFileName} has been processed and moved to ${newFilePath}.`);
        }
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

module.exports = { processFiles };
