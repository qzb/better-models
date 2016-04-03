'use strict';

const Field = require('./field');

/**
 * An enum field. It accepts only specified strings.
 *
 * @example
 *      let field = new EnumField([ 'one', 'two', 'three' ]);
 *
 *      field.deserialize('one'); // returns "one"
 *      field.deserialize('TWO'); // returns "two"
 *      field.deserialize('six'); // throws validation error
 */
class EnumField extends Field {
    /**
     * @param {array} choices list of possible choices
     * @param {boolean} params.caseSensitive makes validation case sensitive
     * @param {boolean} params.blank
     * @param {string} params.default
     */
    constructor(choices, params) {
        super(params);

        if (!choices) {
            throw new Error('Choices list is missing');
        }

        if (!choices.length) {
            throw new Error('Choices list cannot be empty');
        }

        if (choices.find(c => typeof c !== 'string')) {
            throw new Error('All choices must be a strings');
        }

        let choicesMap = {};

        for (let choice of choices) {
            if (this.params.caseSensitive) {
                choicesMap[choice.trim()] = choice;
            } else {
                choicesMap[choice.trim().toLowerCase()] = choice;
            }
        }

        if (Object.keys(choicesMap).length !== choices.length) {
            throw new Error('Choices cannot be doubled');
        }

        if (this.params.default !== undefined && choices.indexOf(this.params.default) === -1) {
            throw new Error('Default value must be one of choices');
        }

        this.choices = choices;
        this.choicesMap = choicesMap;
    }

    /**
     * @returns {string}
     */
    deserialize(value) {
        value = value.trim();

        if (!this.params.caseSensitive) {
            value = value.toLowerCase();
        }

        if (!this.choicesMap.hasOwnProperty(value)) {
            throw 'Value must be one of allowed choices: ' + this.choices.join(', ');
        }

        return this.choicesMap[value];
    }
}

module.exports = EnumField;