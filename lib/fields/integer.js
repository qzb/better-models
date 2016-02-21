'use strict';

const Field = require('./field');

class IntegerField extends Field {
    constructor(params) {
        params = params || {};

        super();

        if (params.default !== undefined && !Number.isInteger(params.default)) {
            throw new Error('Default value of IntegerField must be an integer');
        }

        if (params.min !== undefined && !Number.isInteger(params.min)) {
            throw new Error('Min value of IntegerField must be an integer');
        }

        if (params.max !== undefined && !Number.isInteger(params.max)) {
            throw new Error('Max value of IntegerField must be an integer');
        }

        this.params = {};
        this.params.default = params.default;
        this.params.min = params.min;
        this.params.max = params.max;
        this.params.blank = params.blank;
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

        // It's more strict than parseFloat (or parseInt). It will convert values like '12aaa' to NaN.
        if (typeof value === 'string') {
            value = Number(value);
        }

        // It will throw exception also on Infinity and NaN
        if (!Number.isInteger(value)) {
            throw 'Value must be an integer';
        }

        if (this.params.min !== undefined && value < this.params.min) {
            throw 'Value cannot be less than ' + this.params.min;
        }

        if (this.params.max !== undefined && value > this.params.max) {
            throw 'Value cannot be greater than ' + this.params.max;
        }

        return value;
    }
}

module.exports = IntegerField;
