# TextProcessor

TextProcessor is a JavaScript library devveloped for text analysis. It integrates profanity/badwords filtering, sentiment analysis, and toxicity detection capabilities. By leveraging the AFINN-165 wordlist, Emoji Sentiment Ranking, and the Perspective API, TextProcessor offers a robust toolkit for enhancing content moderation and fostering healthier online interactions.

## Features

- **Profanity Filtering**: Detects and filters out profane/bad words from texts, with options for customization.
- **Sentiment Analysis**: Assesses the emotional tone of text using the AFINN-165 wordlist and Emoji Sentiment Ranking.
- **Toxicity Detection**: Evaluates text for potential toxicity via the Perspective API, aiming to support positive communication environments.

## Installation

Quickly add TextProcessor to your project with npm:

```bash
npm install text-processor --save
```

## Usage and Example Outputs

### Profanity Filtering

Censor or identify profanity within text inputs automatically.

```javascript
const TextProcessor = require('text-processor');
const textProcessor = new TextProcessor();

console.log(textProcessor.clean("Don't be an ash0le"));
// Output: "Don't be an ******"
```

This function helps maintain respectful communication by replacing recognized profane words with placeholders.

### Sentiment Analysis

Evaluate textual sentiment, identifying whether the content is positive, neutral, or negative.

```javascript
const result = textProcessor.analyzeSentiment('Cats are amazing.');
console.dir(result);
```

Example output:

```json
{
  "score": 3,
  "comparative": 1,
  "calculation": [{"amazing": 3}],
  "tokens": ["cats", "are", "amazing"],
  "words": ["amazing"],
  "positive": ["amazing"],
  "negative": []
}
```

The output demonstrates a positive sentiment score, reflecting the text's overall positive tone.

### Toxicity Analysis

Analyze text for toxicity with the Perspective API to maintain constructive discourse.

```javascript
const API_KEY = 'your_api_key_here';
textProcessor.analyzeToxicity("Your text to analyzeSentiment", API_KEY)
  .then(result => console.log(JSON.stringify(result)))
  .catch(err => console.error(err));
```

Sample output:

```json
{
  "attributeScores": {
    "TOXICITY": {
      "summaryScore": {
        "value": 0.021196328,
        "type": "PROBABILITY"
      }
    }
  },
  "languages": ["en"],
  "detectedLanguages": ["en"]
}
```

This provides a toxicity score, indicating how likely the text is perceived as toxic, aiding in moderating content effectively.

### Customizing Profanity Filters

Adapt the profanity list to meet specific needs.

```javascript
// Adding custom bad words
textProcessor.addWords('some', 'bad', 'word');
// Removing words
textProcessor.removeWords('hells', 'sadist');
```

These methods allow you to dynamically update the profanity list, ensuring relevance and efficacy in filtering.

### Registering New Languages for Sentiment Analysis

Expand sentiment analysis to additional languages with custom wordlists.

```javascript
var frLanguage = { labels: { 'stupide': -2 } };
textProcessor.registerLanguage('fr', frLanguage);

const result = textProcessor.analyzeSentiment('Le chat est stupide.', { language: 'fr' });
console.dir(result);
```

Output:

```json
{
  "score": -2,
  "comparative": -0.5,
  "calculation": [{"stupide": -2}],
  "tokens": ["le", "chat", "est", "stupide"],
  "words": ["stupide"],
  "positive": [],
  "negative": ["stupide"]
}
```

This flexibility allows TextProcessor to handle sentiment analysis across different languages, providing detailed insights into textual sentiment.

## License

The MIT License (MIT)

Copyright (c) 2013 Michael Price

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.