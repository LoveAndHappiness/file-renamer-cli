const fs = require('fs');
require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"]
});

async function getFileData({ fileContent }) {
    // Create a chat completion
    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "system",
                content: `Extract the following information from the file content and provide it in JSON format:
                1. Date in the format YYYY-MM-DD.
                2. Sender, abbreviated where applicable (e.g., 'Rechtsanwalt' as 'RA').
                3. A summary of the content in German, up to four words.
                4. The object name, chosen from the predefined list, formatted as '[City Code]-[Street Name and Number]'. If no match is found, use 'Unknown Object'.
                5. Classify the document into one of the following categories:
                   - Grundabgaben
                   - Kontoauszüge
                   - Rechnungen
                   - Vorgänge (default if no other category fits)
                
                JSON Format:
                {
                  "date": "YYYY-MM-DD",
                  "sender": "[Sender]",
                  "summary": "[Content Summary in German]",
                  "object_name": "[Selected Object Name]",
                  "category": "[Category]"
                }
                
                Examples:
                {
                  "date": "2019-03-30",
                  "sender": "RA Peters",
                  "summary": "Widerspruch NKA Mieter Meier",
                  "object_name": "W-Plückersburg 106",
                  "category": "Vorgänge"
                }
                {
                  "date": "2020-05-17",
                  "sender": "Handwerker Schneider",
                  "summary": "Rechnung Boilerreparatur bei Meier",
                  "object_name": "W-Musterstraße 1",
                  "category": "Rechnungen"
                }
                {
                  "date": "2021-09-30",
                  "sender": "an Telekom",
                  "summary": "Widerspruch zur Rechnung",
                  "object_name": "W-Oldenburgstraße 13",
                  "category": "Rechnungen"
                }
                
                Here is the predefined list of object names: ME-Elberfelder Str. 54, ME-Elberfelder Str. 61, W-Albrechtstraße 19, W-Arnoldstraße 2, W-Arrenberger Str. 82, W-Berliner Str. 113, W-Berliner Str. 121, W-Berliner Str. 199, W-Blaffertsberg 85, W-Blaffertsberg 85, W-Bromberger Str. 13, W-Brüderstraße 2, W-Brüderstraße 4, W-Carnaper Str. 16, W-Deweerthstraße 88, W-Eichenstraße 12, W-Eintrachtstraße 75, W-Elias-Eller-Straße 121-123, W-Elias-Eller-Straße 129, W-Erichstraße 6, W-Ernststraße 31, W-Friedrich-Engels-Allee 321, W-Friedrich-Engels-Allee 337, W-Garterlaie 40, W-Große Flurstraße 50, W-Handelstraße 7, W-Hansastraße 58, W-Hohenstein 103, W-Hügelstraße 91, W-Jesinghauser Str. 55, W-Kaiserstraße 45, W-Kaiserstraße 5, W-Kiebitzweg 16A, W-Kreuzstraße 42, W-Leimbacher Str. 60, W-Leimbacher Str. 62, W-Leimbacher Str. 88, W-Leimbacher Str. 90, W-Lenbachstraße 1, W-Loher Str. 3-5, W-Loher Str. 6, W-Luisenstraße 56, W-Mainzer Str. 20, W-Nevigeser Str. 54, W-Oldenburgstraße 13, W-Plückersburg 106, W-Pommernstraße 9-11, W-Reitbahnstraße 2, W-Rolingswerth 14, W-Ronsdorfer Str. 111, W-Ronsdorfer Str. 53, W-Schleswiger Str. 62, W-Schützenstraße 107, W-Schützenstraße 93, W-Schwarzbach 54+54A, W-Schwarzbach 83, W-Sedanstraße 39, W-Siegesstraße 46, W-Sonnborner Str. 94+96, W-Steinbeck 16, W-Steinkuhle 1, W-Steinweg 14, W-Steinweg 50, W-Sternstraße 48A, W-Tannenstraße 62, W-Thorner Str. 31, W-Uellendahler Str. 95, W-Von-der-Tann-Straße 16, W-Wartburgstraße 34, W-Wichlinghauser Str. 28+28A, W-Wichlinghauser Str. 30+30a+30b, W-Wittensteinstraße 219, W-Wupperfelder Markt 1`
            },
            {
                role: "user",
                content: fileContent
            }
        ]
    })

    // Log the chatCompletion object
    // console.log(JSON.stringify(chatCompletion, null, 2));
    
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