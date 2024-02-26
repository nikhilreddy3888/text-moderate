# TextModerate

TextModerate is a JavaScript library developed for text analysis. It integrates profanity/badwords filtering, sentiment analysis, and toxicity detection capabilities. By leveraging the Badwords lists, AFINN-165 wordlist, Emoji Sentiment Ranking, and the Perspective API. TextModerate offers a robust toolkit for enhancing content moderation and fostering healthier online interactions.

## Features

-   **Profanity Filtering**: Detects and filters out profane/bad words from texts, with options for customization. 
-   **Sentiment Analysis**: Assesses the emotional tone of text using the AFINN-165 wordlist and Emoji Sentiment Ranking.
-   **Toxicity Detection**: Evaluates text for potential toxicity via the Perspective API, aiming to support positive communication environments. This is interface to call Perspective API developed by Google.

## Supported Languages

English and French for Profanity and Sentiment Analysis, can be extended. Toxicity Detection works for any language.

## Installation

```bash
npm install text-moderate --save
```

## Usage and Example Outputs

## Profanity Filtering
### Profanity Filtering

Censor or identify profanity within text inputs automatically. Using badwords-list from  Google's WDYL Project.

```javascript
const TextModerate = require('text-moderate');
const textModerate = new TextModerate();

console.log(textModerate.isProfane("Don't be an ash0le"))
// Output: True

console.log(textModerate.clean("Don't be an ash0le"));
// Output: "Don't be an ******"
```

### Placeholder Overrides for Filtering

```js
var customTextModerate = new TextModerate({ placeHolder: 'x'});

customTextModerate.clean("Don't be an ash0le"); // Don't be an xxxxxx
```

### Adding Words to the Blacklist

```js
textModerate.addWords('some', 'bad', 'word');

textModerate.clean("some bad word!") // **** *** ****!
```

### Remove words from the blacklist

```js
textModerate.removeWords('hells', 'sadist');

textModerate.clean("some hells word!"); //some hells word!
```

This functions helps maintain respectful communication by recognizing and replacing recognized profane words with placeholders.

## Sentiment Dectection

### Sentiment Analysis

Evaluate textual sentiment, identifying whether the content is positive, neutral, or negative.

```javascript
const result = textModerate.analyzeSentiment('Cats are amazing.');
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

Here, "comparative" Score can be seen as main metric if it's zero netural and greater 0.5 is positive and less than -0.5 is negative

### Registering New Language for Sentiment Analysis

```js
var frLanguage = {
  labels: { 'stupide': -2 }
};
textModerate.registerLanguage('fr', frLanguage);

var result = textModerate.analyzeSentiment('Le chat est stupide.', { language: 'fr' });
console.dir(result);    // Score: -2, Comparative: -0.5
```

## Toxicity Dectection 

### Toxicity Analysis

Analyze text for toxicity with the Perspective API to maintain constructive discourse. Perspective API is developed and maintianed by Google. 

```javascript
const API_KEY = 'your_api_key_here'; // Replace with your Persective API key from Google API Services
textModerate.analyzeToxicity("Your text to analyzeSentiment", API_KEY)
  .then(result => console.log(JSON.stringify(result)))
  .catch(err => console.error(err));
```

The Perspective API is currently free API with rate limit of 60 per minute. (As of 2023 Decemeber) Link: <https://support.perspectiveapi.com/s/docs-get-started?language=en_US>

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
According to this paper and experiments:- soft toxicity score is 0.5 and hard toxicty score is 0.7
Refer to this paper : <https://aclanthology.org/2021.findings-emnlp.210.pdf>

### API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

##### Table of Contents

-   [constructor](#constructor)
-   [isProfane](#isprofane)
-   [replaceWord](#replaceword)
-   [clean](#clean)
-   [addWords](#addwords)
-   [removeWords](#removewords)
-   [registerLanguage](#registerlanguage)
-   [analyzeSentiment](#analyzesentiment)
-   [analyzeToxicity](#analyzetoxicity)
-   [tokenize](#tokenize)
-   [addLanguage](#addlanguage)
-   [getLanguage](#getlanguage)
-   [getLabels](#getlabels)
-   [applyScoringStrategy](#applyscoringstrategy)

#### constructor

TextModerate constructor.
Combines functionalities of word filtering and sentiment analysis.

**Parameters**

-   `options` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** TextModerate instance options. (optional, default `{}`)
    -   `options.emptyList` **[boolean](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** Instantiate filter with no blacklist. (optional, default `false`)
    -   `options.list` **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** Instantiate filter with custom list. (optional, default `[]`)
    -   `options.placeHolder` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Character used to replace profane words. (optional, default `'*'`)
    -   `options.regex` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Regular expression used to sanitize words before comparing them to blacklist. (optional, default `/[^a-zA-Z0-9|\$|\@]|\^/g`)
    -   `options.replaceRegex` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Regular expression used to replace profane words with placeHolder. (optional, default `/\w/g`)
    -   `options.splitRegex` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Regular expression used to split a string into words. (optional, default `/\b/`)
    -   `options.sentimentOptions` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options for sentiment analysis. (optional, default `{}`)

#### isProfane

Determine if a string contains profane language.

**Parameters**

-   `string` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** String to evaluate for profanity.

#### replaceWord

Replace a word with placeHolder characters.

**Parameters**

-   `string` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** String to replace.

#### clean

Evaluate a string for profanity and return an edited version.

**Parameters**

-   `string` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Sentence to filter.

#### addWords

Add word(s) to blacklist filter / remove words from whitelist filter.

**Parameters**

-   `words` **...any** 
-   `word` **...[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Word(s) to add to blacklist.

#### removeWords

Add words to whitelist filter.

**Parameters**

-   `words` **...any** 
-   `word` **...[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Word(s) to add to whitelist.

#### registerLanguage

Registers the specified language.

**Parameters**

-   `languageCode` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Two-digit code for the language to register.
-   `language` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The language module to register.

#### analyzeSentiment

Performs sentiment analysis on the provided input 'phrase'.

**Parameters**

-   `phrase` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Input phrase.
-   `opts` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** Options. (optional, default `{}`)
-   `callback` **[function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function)** Optional callback.

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

#### analyzeToxicity

Analyzes the toxicity of a given text using the Perspective API.

**Parameters**

-   `text` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Text to analyze.
-   `apiKey` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** API key for the Perspective API.

Returns **[Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)** A promise that resolves with the analysis result.

#### tokenize

Remove special characters and return an array of tokens (words).

**Parameters**

-   `input` **[string](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Input string

Returns **[array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** Array of tokens

#### addLanguage

Registers the specified language

**Parameters**

-   `languageCode` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Two-digit code for the language to register
-   `language` **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** The language module to register

#### getLanguage

Retrieves a language object from the cache,
or tries to load it from the set of supported languages

**Parameters**

-   `languageCode` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Two-digit code for the language to fetch

#### getLabels

Returns AFINN-165 weighted labels for the specified language

**Parameters**

-   `languageCode` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Two-digit language code

Returns **[Object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

#### applyScoringStrategy

Applies a scoring strategy for the current token

**Parameters**

-   `languageCode` **[String](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String)** Two-digit language code
-   `tokens` **[Array](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array)** Tokens of the phrase to analyze
-   `cursor` **int** Cursor of the current token being analyzed
-   `tokenScore` **int** The score of the current token being analyzed

## How Sentiment Analysis works Here

### AFINN

AFINN is a list of words rated for valence with an integer between minus five (negative) and plus five (positive). Sentiment analysis is performed by cross-checking the string tokens (words, emojis) with the AFINN list and getting their respective scores. The comparative score is simply: `sum of each token / number of tokens`. So for example let's take the following:

`I love cats, but I am allergic to them.`

That string results in the following:

```javascript
{
    score: 1,
    comparative: 0.1111111111111111,
    calculation: [ { allergic: -2 }, { love: 3 } ],
    tokens: [
        'i',
        'love',
        'cats',
        'but',
        'i',
        'am',
        'allergic',
        'to',
        'them'
    ],
    words: [
        'allergic',
        'love'
    ],
    positive: [
        'love'
    ],
    negative: [
        'allergic'
    ]
}
```

-   Returned Objects
    -   **Score**: Score calculated by adding the sentiment values of recognized words.
    -   **Comparative**: Comparative score of the input string.
    -   **Calculation**: An array of words that have a negative or positive valence with their respective AFINN score.
    -   **Token**: All the tokens like words or emojis found in the input string.
    -   **Words**: List of words from input string that were found in AFINN list.
    -   **Positive**: List of positive words in input string that were found in AFINN list.
    -   **Negative**: List of negative words in input string that were found in AFINN list.

In this case, love has a value of 3, allergic has a value of -2, and the remaining tokens are neutral with a value of 0. Because the string has 9 tokens the resulting comparative score looks like:
`(3 + -2) / 9 = 0.111111111`

This approach leaves you with a mid-point of 0 and the upper and lower bounds are constrained to positive and negative 5 respectively (the same as each token! 😸). For example, let's imagine an incredibly "positive" string with 200 tokens and where each token has an AFINN score of 5. Our resulting comparative score would look like this:

    (max positive score * number of tokens) / number of tokens
    (5 * 200) / 200 = 5

### Tokenization

Tokenization works by splitting the lines of input string, then removing the special characters, and finally splitting it using spaces. This is used to get list of words in the string.

To incorporate the "Future Improvement" section into your existing documentation while maintaining the flow and structure, you can simply add it right before the "Credits" section. Here's how it would look:

---

## Future Improvements

The development and enhancement of the "text-moderate" library will continue to focus on making the tool more versatile and effective for developers and content managers. Planned future improvements include:

1. **More Languages Support**: Expanding the library to support additional languages for profanity filtering and sentiment analysis, making it more accessible and useful for a global audience.

2. **Sentiment Analysis in a More Robust Way**: Enhancing the sentiment analysis feature to provide deeper insights into the emotional tone of texts, possibly by incorporating machine learning techniques for greater accuracy.

3. **Toxicity Category Attribute Along with Score**: Introducing a detailed breakdown of toxicity attributes (e.g., insult, threat, obscenity) alongside the overall toxicity score to give users a more nuanced understanding of content analysis results.

By focusing on these areas, "text-moderate" aims to remain at the forefront of content moderation technology, providing developers with the tools they need to maintain positive and safe online environments.

## Credits

1. [Perspective API](https://perspectiveapi.com/)
2. [Sentiment](https://github.com/thisandagain/sentiment)
3. [Badwords](https://github.com/MauriceButler/badwords)

## License

The MIT License (MIT)

Copyright (c) 2013 Michael Price

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.