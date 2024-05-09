// Main file system operations (read, rename, move)

const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const { getNewFileName } = require('../openai/api');
const { getReferenceCode } = require('../openai/getReferenceCode');

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

    const text = await extractTextFromPDF(originalPath, { maxLength: 4000 });
    // console.log(`Text extracted from ${file}:`, text);
    console.log(`Text extracted successfully from PDF.`);
    console.log("\n");

    // Get the reference code from the file
    console.log("Getting reference code...");
    let referenceCode = await getReferenceCode({ fileContent: text });
    console.log(`Reference code: ${referenceCode}`);
    console.log("\n");

    // VORRÜBERGEHEND AUSSER BETRIEB
    // let newFileName = await getNewFileName({ fileContent: text });
    // const newFilePath = path.join(processedDir, `${newFileName}${path.extname(originalPath)}`);
    // await renameFile(originalPath, newFilePath);

    console.log(`Renaming successful.`);
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