const axios = require('axios');

async function getNewFileName(content) {
    // const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
    //     prompt: content,
    //     max_tokens: 60
    // }, {
    //     headers: {
    //         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    //     }
    // });

    console.log('Response from OpenAI API');
    // return response.data.choices[0].text.trim();
}

module.exports = {
    getNewFileName
};