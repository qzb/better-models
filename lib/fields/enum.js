'use strict';

const Field = require('./field');

class EnumField extends Field {
    constructor(choices, params) {
        params = params || {};

        super();

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
            if (params.caseSensitive) {
                choicesMap[choice.trim()] = choice;
            } else {
                choicesMap[choice.trim().toLowerCase()] = choice;
            }
        }

        if (Object.keys(choicesMap).length !== choices.length) {
            throw new Error('Choices cannot be doubled');
        }

        if (params.default !== undefined && choices.indexOf(params.default) === -1) {
            throw new Error('Default value must be one of choices');
        }

        this.choices = choices;
        this.choicesMap = choicesMap;
        this.params = {};
        this.params.default = params.default;
        this.params.blank = params.blank;
        this.params.caseSensitive = params.caseSensitive;
    }

    deserialize(value) {
        if (value == null || value === '') {
            if (this.params.default !== undefined) {
                return this.params.default;
            }

            if (this.params.blank) {
                return null;
            }

            throw 'Value cannot be empty';
        }

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