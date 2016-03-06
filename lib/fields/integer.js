'use strict';

const NumberField = require('./number');

class IntegerField extends NumberField {
    constructor(params) {
        super(params);

        if (this.params.default !== undefined && !Number.isInteger(this.params.default)) {
            throw new Error('Default value must be an integer');
        }

        if (this.params.min !== undefined && !Number.isInteger(this.params.min)) {
            throw new Error('Min value must be an integer');
        }

        if (this.params.max !== undefined && !Number.isInteger(this.params.max)) {
            throw new Error('Max value must be an integer');
        }
    }

    deserialize(value) {
        value = super.deserialize(value);

        if (value !== null && !Number.isInteger(value)) {
            throw 'Value must be an integer';
        }

        return value;
    }
}

module.exports = IntegerField;
