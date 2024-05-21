const fs = require('fs').promises;
const path = require('path');

async function loadProperties() {
    try {
        const propertiesPath = path.join(__dirname, '../../properties.json');
        const propertiesData = await fs.readFile(propertiesPath, 'utf8');
        return JSON.parse(propertiesData);
    } catch (error) {
        console.error('Error loading properties:', error);
        return [];
    }
}

module.exports = { loadProperties };