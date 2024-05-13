require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');

const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
    organizationId: process.env["OPENAI_ORGANIZATION_ID"]
});



async function getReferenceCode({ fileContent: text }) {
    if (!text) {
        throw new Error('File content is null or undefined.');
    } 

    // Read property_list.json using fs.promises.readFile
    const referenceCodes = JSON.parse(await fs.promises.readFile('property_list.json', 'utf8'));
    // console.log(referenceCodes);

    console.log('Making API call to Reference Code Assistant on OpenAI...');
    // const thread = await client.beta.threads.create();
    // const message = client.beta.threads.messages.create(thread.id, {
    //     role: 'user',
    //     content: text
    // });

    // Generate a random index and select a reference code
    const randomIndex = Math.floor(Math.random() * referenceCodes.length);
    const referenceCode = referenceCodes[randomIndex];

    console.log('Selected Reference Code:', referenceCode);

    return referenceCode;
}

module.exports = {
    getReferenceCode
};
