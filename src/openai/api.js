require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"]
});


/**
 * Generates a new filename based on the content provided using the OpenAI API.
 * This function expects an object with a 'fileContent' property and uses destructuring
 * to extract this property directly in the function signature.
 * 
 * @param {Object} param0 - An object containing the 'fileContent' property.
 * @returns {Promise<string>} The new filename, cleaned and formatted.
 */
async function getNewFileName({ fileContent: text }) {
    console.log('File content received:', text);  // Log to check what content is being received
    if (!text) {
        throw new Error('File content is null or undefined.');
    }
    console.log('Making response to OpenAI API...');
    // Create a chat completion
    const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'Rename the file in German according to the following schema: "<YYYY-MM-DD> - <sender> - <summary maximum 4 words> - W-<reference>". The reference is the name of the street with the number, e.g. "Berliner Str. 121" or "Musterstraße 12".' },
            { role: 'user', content: text }
        ]
    });
    console.log('Response received from OpenAI API.');
    console.log(response.choices[0].message);

    // Extract the filename from the response, trim whitespace, and remove any quotes
    let newFileName = response.choices[0].message.content.trim();
    newFileName = newFileName.replace(/"/g, '');
    console.log(`New Filename: ${newFileName}`);

    // Check if newFileName is not undefined
    if (newFileName) {
        // Return the generated filename
        return newFileName;
    } else {
        throw new Error('No text returned from OpenAI API');
    }
}

module.exports = {
    getNewFileName
};