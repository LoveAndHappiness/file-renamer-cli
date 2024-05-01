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
        const files = await fs.readdir(filesDir);
        for (const file of files) {
            if (file === 'renamed') continue;
            await processSingleFile(file);
        }
    } catch (error) {
        console.error('Error processing files:', error);
    }
}

async function processSingleFile(file) {
    const originalPath = path.join(filesDir, file);
    const processedPath = path.join(processedDir, file);

    console.log(`Processing file: ${file}...`);
    await simulateDelay(100);

    const text = await extractTextFromPDF(originalPath, { maxLength: 4000 });
    let newFileName = await generateNewFileName(text);
    const newFilePath = path.join(processedDir, `${newFileName}${path.extname(originalPath)}`);
    await renameFile(originalPath, newFilePath);

    console.log(`${file} has been processed and moved to ${newFilePath}.`);
}

async function simulateDelay(duration) {
    return new Promise(resolve => setTimeout(resolve, duration));
}

async function generateNewFileName(text) {
    console.log('Making response to OpenAI API...');
    let newFileName = await getNewFileName({ fileContent: text });
    newFileName = newFileName.replace(/"/g, '');
    await simulateDelay(2000);
    console.log('Response received from OpenAI API.');
    console.log(`New Filename generated: ${newFileName}`);
    return newFileName;
}

async function renameFile(originalPath, newFilePath) {
    await fs.rename(originalPath, newFilePath);
}

async function extractTextFromPDF(pdfPath, options = { maxLength: 4000 }) {
    const dataBuffer = await fs.readFile(pdfPath);
    try {
        const data = await pdfParse(dataBuffer);
        let text = data.text;
        if (options.maxLength) {
            text = text.substring(0, options.maxLength);
        }
        console.log(`Extracted text from ${path.basename(pdfPath)}:`, text.substring(0, 200));
        return text;
    } catch (error) {
        console.error(`Error extracting text from ${pdfPath}:`, error);
        return '';
    }
}

// Export the function for use in other parts of your application
module.exports = {
    processFiles
};