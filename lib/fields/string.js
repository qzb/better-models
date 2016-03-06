'use strict';

const Field = require('./field');

class StringField extends Field {
    constructor(params) {
        params = params || {};

        super();

        if (params.default !== undefined && typeof params.default !== 'string') {
            throw new Error('Default value of StringField must be a string');
        }

        if (params.minLength !== undefined && (!Number.isInteger(params.minLength) || params.minLength < 0)) {
            throw new Error('Min length of StringField must be a positive integer');
        }

        if (params.maxLength !== undefined && (!Number.isInteger(params.maxLength) || params.maxLength < 0)) {
            throw new Error('Max length of StringField must be a positive integer');
        }

        if (params.minLength > params.maxLength) {
            throw new Error('Max length must be greater than min length');
        }

        this.params = {};
        this.params.default = params.default;
        this.params.minLength = params.minLength;
        this.params.maxLength = params.maxLength;
        this.params.trim = params.trim;
        this.params.blank = params.blank;
    }

    deserialize(value) {
        if (value == null) {
            value = '';
        }

        if (typeof value !== 'string') {
            throw 'Value must be a string'
        }

        if (this.params.trim) {
            value = value.trim();
        }

        if (value === '') {
            if (this.params.default !== undefined) {
                return this.params.default;
            }

            if (this.params.blank) {
                return '';
            }

            throw 'Value cannot be empty';
        }

        if (this.params.minLength !== undefined && value.length < this.params.minLength) {
            throw 'Value\'s length cannot be less than ' + this.params.minLength;
        }

        if (this.params.maxLength !== undefined && value.length > this.params.maxLength) {
            throw 'Value\'s length cannot be greater than ' + this.params.maxLength;
        }

        return value;
    }
}

module.exports = StringField;
