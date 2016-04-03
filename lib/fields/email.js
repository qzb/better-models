'use strict';

const validateEmail = require('email-validator').validate;
const Field = require('./field');
const StringField = require('./string');

/**
 * A {@link StringField} which checks if value is a valid email.
 *
 * @example
 *      let field = new EmailField();
 *
 *      field.deserialize('SOME.EMAIL@GMAIL.COM'); // returns "some.email@gmail.com"
 *      field.deserialize('SOME.EMAIL.GMAIL.COM'); // throws validation error
 */
class EmailField extends StringField {
    /**
     * @param {boolean} params.caseSensitive disables normalization to lower case
     * @param {boolean} params.optional
     * @param {string} params.default
     */
    constructor(params) {
        super(Object.assign({}, params, { trim: true }));

        if (this.params.default !== undefined && !validateEmail(this.params.default)) {
            throw new Error('Default value must be a valid email address');
        }
    }

    /**
     * @returns {string}
     */
    deserialize(value) {
        value = super.deserialize(value);

        if (!this.params.caseSensitive) {
            value = value.toLowerCase();
        }

        if (value && !validateEmail(value)) {
            throw new Field.ValidationError('Value must be a valid email address');
        }

        return value;
    }
}

module.exports = EmailField;
