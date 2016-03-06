'use strict';

const validateEmail = require('email-validator').validate;
const StringField = require('./string');

class EmailField extends StringField {
    constructor(params) {
        params = params || {};

        super({
            blank: params.blank,
            default: params.default,
            trim: true
        });

        if (params.default !== undefined && !validateEmail(params.default)) {
            throw new Error('Default value must be a valid email address');
        }
    }

    deserialize(value) {
        value = super.deserialize(value);

        if (value && !validateEmail(value)) {
            throw 'Value must be a valid email address';
        }

        return value;
    }
}

module.exports = EmailField;