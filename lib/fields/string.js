'use strict';

const Field = require('./field');

/**
 * A text field. Accepts any string.
 *
 * @example
 *      let field = new StringField({ maxLength: 3 });
 *
 *      field.deserialize('123');  // returns "123"
 *      field.deserialize(123);    // throws validation error
 *      field.deserialize('1234'); // throws validation error
 */
class StringField extends Field {
    /**
     * @param {number} params.minLength minimum length of string, must be a positive integer
     * @param {number} params.maxLength maximum length of string, must be a positive integer
     * @param {boolean} params.blank
     * @param {string} params.default
     */
    constructor(params) {
        super(params);

        if (this.params.default !== undefined && typeof this.params.default !== 'string') {
            throw new Error('Default value must be a string');
        }

        if (this.params.minLength !== undefined && (!Number.isInteger(this.params.minLength) || this.params.minLength < 0)) {
            throw new Error('Min length must be a positive integer');
        }

        if (this.params.maxLength !== undefined && (!Number.isInteger(this.params.maxLength) || this.params.maxLength < 0)) {
            throw new Error('Max length must be a positive integer');
        }

        if (this.params.minLength > this.params.maxLength) {
            throw new Error('Max length must be greater than min length');
        }
    }

    /**
     * @returns {string}
     */
    deserialize(value) {
        if (typeof value !== 'string') {
            throw 'Value must be a string';
        }

        if (this.params.trim) {
            value = value.trim();

            if (value === '') {
                return this.deserializeBlank();
            }
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
