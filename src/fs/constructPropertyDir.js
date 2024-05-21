const path = require('path');
const fs = require('fs').promises;

async function ensureDirectoryExists(dir) {
    try {
        await fs.mkdir(dir, { recursive: true });
        console.log(`Directory created or already exists: ${dir}`);
    } catch (error) {
        console.error(`Error creating directory ${dir}:`, error);
    }
}

async function constructPropertyDir(baseDir, objectName, date, category) {
    const year = date.split('-')[0]; // Extract the year from the date

    let categoryDir;
    switch (category) {
        case 'Rechnungen':
            categoryDir = 'Rechnungen';
            break;
        case 'Grundabgaben':
            categoryDir = 'Grundabgaben';
            break;
        case 'Kontoauszüge':
            categoryDir = 'Kontoauszüge';
            break;
        default:
            categoryDir = 'Vorgänge';
            break;
    }

    const propertyDir = path.join(baseDir, objectName, 'Jahresordner', year, categoryDir);
    await ensureDirectoryExists(propertyDir);

    return propertyDir;
}

module.exports = { constructPropertyDir };