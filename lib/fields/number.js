'use strict';

const Field = require('./field');

class NumberField extends Field {
    constructor(params) {
        params = params || {};

        super();

        if (params.default !== undefined && !Number.isFinite(params.default)) {
            throw new Error('Default value must be a number');
        }

        if (params.min !== undefined && !Number.isFinite(params.min)) {
            throw new Error('Min value must be a number');
        }

        if (params.max !== undefined && !Number.isFinite(params.max)) {
            throw new Error('Max value must be a number');
        }

        if (params.max < params.min) {
            throw new Error('Max value must be greater than min value');
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

        // It's more strict than parseFloat. It will convert values like '12aaa' to NaN.
        if (typeof value === 'string') {
            value = Number(value);
        }

        // It will throw exception on Infinity and NaN
        if (!Number.isFinite(value)) {
            throw 'Value must be a number';
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

module.exports = NumberField;
