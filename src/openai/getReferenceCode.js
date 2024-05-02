require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
    organizationId: process.env["OPENAI_ORGANIZATION_ID"]
});



async function getReferenceCode({ fileContent: text }) {
    if (!text) {
        throw new Error('File content is null or undefined.');
    } else {
        console.log('File content received.');
    }

    console.log('Making API call to Reference Code Assistant on OpenAI...');

    async function main(text) {
        // set up the assistant - they are persistent, so only create once in playground and retrieve them here
        const referenceCodeAssistant = await client.beta.assistants.retrieve("asst_qkzfrIREI9HMuzkw1LBZ9nCn");

        // create a thread - threads are persistend and get deleted after 30 days
        const thread = await client.beta.threads.create();

        // create a message and add to thread
        const message = await client.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: `Get the reference code from the property_list.json file by judging which reference fits with the following file content: ${text}`
            }
        );

        // run the thread using the assistant
        const run = client.beta.threads.runs.createAndStream(thread.id, {assistant_id: "asst_qkzfrIREI9HMuzkw1LBZ9nCn"})
            .on('textDelta', (textDelta) => print(textDelta.value));
        
        // send a newline when done
        const result = await run.finalRun();
        console.log("\n");
    }

    let result = main(text);
    console.log(`And the result is: ${result}`);
    return result;

}

module.exports = {
    getReferenceCode
};