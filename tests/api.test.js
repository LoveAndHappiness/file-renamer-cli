const { getNewFileName } = require('../api'); // adjust the path to your api.js file

describe('getNewFileName', () => {
    it('returns a filename', async () => {
        const prompt = 'Your prompt goes here';
        const content = 'Your content goes here';
        const filename = await getNewFileName(prompt, content);
        console.log(filename);
        // Add your assertions here
    });
});