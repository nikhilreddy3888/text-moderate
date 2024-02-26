const { google } = require('googleapis');
const localList = require('./lang.json').words;
const baseList = require('badwords-list').array;
var frenchList = require('french-badwords-list').array;
var tokenize = require('./tokenize');
var languageProcessor = require('./language-processor');

class TextModerate {
    /**
     * TextModerate constructor.
     * Combines functionalities of word filtering and sentiment analysis.
     * @constructor
     * @param {Object} options - TextModerate instance options.
     * @param {boolean} [options.emptyList=false] - Instantiate filter with no blacklist.
     * @param {array} [options.list=[]] - Instantiate filter with custom list.
     * @param {string} [options.placeHolder='*'] - Character used to replace profane words.
     * @param {string} [options.regex=/[^a-zA-Z0-9|\$|\@]|\^/g] - Regular expression used to sanitize words before comparing them to blacklist.
     * @param {string} [options.replaceRegex=/\w/g] - Regular expression used to replace profane words with placeHolder.
     * @param {string} [options.splitRegex=/\b/] - Regular expression used to split a string into words.
     * @param {Object} [options.sentimentOptions={}] - Options for sentiment analysis.
     */
    constructor(options = {}) {
        // Filter properties
        this.list = options.emptyList ? [] : Array.prototype.concat.apply(localList, [baseList, frenchList, options.list || []]);
        this.exclude = options.exclude || [];
        this.splitRegex = options.splitRegex || /\b/;
        this.placeHolder = options.placeHolder || '*';
        this.regex = options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g;
        this.replaceRegex = options.replaceRegex || /\w/g;

        // Sentiment properties
        this.sentimentOptions = options.sentimentOptions || {};
    }

    // Filter methods

    /**
     * Determine if a string contains profane language.
     * @param {string} string - String to evaluate for profanity.
     */
    isProfane(string) {
        return this.list
            .filter((word) => {
                const wordExp = new RegExp(`\\b${word.replace(/(\W)/g, '\\$1')}\\b`, 'gi');
                return !this.exclude.includes(word.toLowerCase()) && wordExp.test(string);
            })
            .length > 0 || false;
    }

    /**
     * Replace a word with placeHolder characters.
     * @param {string} string - String to replace.
     */
    replaceWord(string) {
        return string
            .replace(this.regex, '')
            .replace(this.replaceRegex, this.placeHolder);
    }

    /**
     * Evaluate a string for profanity and return an edited version.
     * @param {string} string - Sentence to filter.
     */
    clean(string) {
        return string.split(this.splitRegex).map((word) => {
            return this.isProfane(word) ? this.replaceWord(word) : word;
        }).join(this.splitRegex.exec(string)[0]);
    }

    /**
     * Add word(s) to blacklist filter / remove words from whitelist filter.
     * @param {...string} word - Word(s) to add to blacklist.
     */
    addWords(...words) {
        this.list.push(...words);

        words
            .map(word => word.toLowerCase())
            .forEach((word) => {
                if (this.exclude.includes(word)) {
                    this.exclude.splice(this.exclude.indexOf(word), 1);
                }
            });
    }

    /**
     * Add words to whitelist filter.
     * @param {...string} word - Word(s) to add to whitelist.
     */
    removeWords(...words) {
        this.exclude.push(...words.map(word => word.toLowerCase()));
    }

    // Sentiment methods

    /**
     * Registers the specified language.
     * @param {String} languageCode - Two-digit code for the language to register.
     * @param {Object} language - The language module to register.
     */
    registerLanguage(languageCode, language) {
        languageProcessor.addLanguage(languageCode, language);
    }

    /**
     * Performs sentiment analysis on the provided input 'phrase'.
     * @param {String} phrase - Input phrase.
     * @param {Object} opts - Options.
     * @param {function} callback - Optional callback.
     * @return {Object}
     */
    analyzeSentiment(phrase, opts = {}, callback) {
        if (typeof phrase === 'undefined') phrase = '';
        if (typeof opts === 'function') {
            callback = opts;
            opts = {};
        }

        var languageCode = opts.language || 'en';
        var labels = languageProcessor.getLabels(languageCode);

        // Merge extra labels
        if (typeof opts.extras === 'object') {
            labels = Object.assign(labels, opts.extras);
        }

        // Storage objects
        var tokens = tokenize(phrase),
            score = 0,
            words = [],
            positive = [],
            negative = [],
            calculation = [];

        // Iterate over tokens
        var i = tokens.length;
        while (i--) {
            var obj = tokens[i];
            if (!Object.prototype.hasOwnProperty.call(labels, obj)) continue;
            words.push(obj);

            // Apply scoring strategy
            var tokenScore = labels[obj];
            tokenScore = languageProcessor.applyScoringStrategy(languageCode, tokens, i, tokenScore);
            if (tokenScore > 0) positive.push(obj);
            if (tokenScore < 0) negative.push(obj);
            score += tokenScore;

            // Calculations breakdown
            var zipObj = {};
            zipObj[obj] = tokenScore;
            calculation.push(zipObj);
        }

        var result = {
            score: score,
            comparative: tokens.length > 0 ? score / tokens.length : 0,
            calculation: calculation,
            tokens: tokens,
            words: words,
            positive: positive,
            negative: negative
        };

        // Handle optional async interface
        if (typeof callback === 'function') {
            process.nextTick(function () {
                callback(null, result);
            });
        } else {
            return result;
        }
    }

    /**
     * Analyzes the toxicity of a given text using the Perspective API.
     * @param {string} text - Text to analyze.
     * @param {string} apiKey - API key for the Perspective API.
     * @return {Promise} - A promise that resolves with the analysis result.
     */
    analyzeToxicity(text, apiKey) {
        const DISCOVERY_URL = 'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

        return google.discoverAPI(DISCOVERY_URL).then(client => {
            const analyzeRequest = {
                comment: { text },
                requestedAttributes: { TOXICITY: {} },
            };

            return client.comments.analyze({
                key: apiKey,
                resource: analyzeRequest,
            });
        }).then(response => response.data)
            .catch(err => {
                console.error('Error analyzing toxicity:', err);
                throw err;
            });
    }

}

module.exports = TextModerate;
