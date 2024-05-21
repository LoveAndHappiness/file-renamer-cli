const fs = require('fs');
const { generatePrompt } = require('./generatePrompt');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"]
});

async function getFileData({ fileContent, properties }) {
    const prompt = generatePrompt(properties);

    // Create a chat completion
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: prompt
            },
            {
                role: "user",
                content: fileContent
            }
        ]
    })
   
    // Check if chatCompletion.choices[0].message.content is not undefined
    if (chatCompletion.choices && chatCompletion.choices[0] && chatCompletion.choices[0].message && chatCompletion.choices[0].message.content) {
        // Return the generated filename
        return chatCompletion.choices[0].message.content.trim();
    } else {
        throw new Error('No text returned from OpenAI API');
    }
}

module.exports = {
    getFileData
};