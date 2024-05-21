function generatePrompt(properties) {
    return `Extract the following information from the file content and provide it in JSON format:
    1. Date in the format YYYY-MM-DD.
    2. Sender, abbreviated where applicable (e.g., 'Rechtsanwalt' as 'RA').
    3. A summary of the content in German, up to four words.
    4. The object name, chosen from the predefined list, formatted as '[City Code]-[Street Name and Number]'. If no match is found, use 'Unknown Object'. Make sure you don't use just the recipient address, since the property management company Expimo is located at the same address as the property we manage.
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
    
    Here is the predefined list of object names: ${properties.join(', ')}`;
}

module.exports = { generatePrompt };