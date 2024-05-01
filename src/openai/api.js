const fs = require('fs');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"]
});

async function getNewFileName({ fileContent }) {
    // Create a chat completion
    const chatCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: 'Rename the file in German according to the following schema: "<YYYY-MM-DD> - <sender> - <summary maximum 4 words> - W-<reference>". The reference is the name of the street with the number, e.g. "Berliner Str. 121" or "Musterstraße 12".'
            },
            {
                role: 'user',
                content: fileContent
            }
        ]
    })

    // Log the chatCompletion object
    console.log(JSON.stringify(chatCompletion, null, 2));
    
    // Check if chatCompletion.choices[0].message.content is not undefined
    if (chatCompletion.choices && chatCompletion.choices[0] && chatCompletion.choices[0].message && chatCompletion.choices[0].message.content) {
        // Return the generated filename
        return chatCompletion.choices[0].message.content.trim();
    } else {
        throw new Error('No text returned from OpenAI API');
    }
}

module.exports = {
    getNewFileName
};