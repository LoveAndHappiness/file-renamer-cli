// src/fs/readPdfText.js
const fs = require('fs');
const pdfParse = require('pdf-parse');
const PDFParser = require('pdf2json');

class PdfReader {
    constructor(strategy) {
        this.strategy = strategy;
    }

    async read(pdfPath) {
        return this.strategy.read(pdfPath);
    }
}

class PdfParseStrategy {
    async read(pdfPath) {
        const dataBuffer = await fs.promises.readFile(pdfPath);
        const data = await pdfParse(dataBuffer);
        return data.text;
    }
}

class Pdf2JsonStrategy {
    async read(path) {
        return new Promise((resolve, reject) => {
            const pdfParser = new PDFParser(this, 1);
            
            pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
            pdfParser.on("pdfParser_dataReady", pdfData => {
                if (pdfData.formImage && pdfData.formImage.Pages) {
                    resolve(pdfData.formImage.Pages);
                } else {
                    reject(new Error('No pages found in PDF.'));
                }
            });

            pdfParser.loadPDF(path);
        });
    }
}

module.exports = { PdfReader, PdfParseStrategy, Pdf2JsonStrategy };