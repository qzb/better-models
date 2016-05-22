'use strict';

const Field = require('./field');
const NumberField = require('./number');

/**
 * A NumberField which additionally checks if value is an integer.
 *
 * @example
 *      const field = new IntegerField();
 *
 *      field.deserialize(123); // returns 123
 *      field.deserialize(1.3); // throws validation error
 */
class IntegerField extends NumberField {
    /**
     * @param {object} [params]
     * @param {number} [params.min] - minimum value
     * @param {number} [params.max] - maximum value
     * @param {boolean} [params.optional]
     * @param {number} [params.default]
     */
    constructor(params) {
        super(params);
    }

    init(params) {
        super.init(params);

        if (this.params.min !== undefined && !Number.isInteger(this.params.min)) {
            throw new Error('Min value must be an integer');
        }

        if (this.params.max !== undefined && !Number.isInteger(this.params.max)) {
            throw new Error('Max value must be an integer');
        }
    }

    /**
     * @returns {number}
     */
    deserialize(value) {
        value = super.deserialize(value);

        if (value !== null && !Number.isInteger(value)) {
            throw new Field.ValidationError('Value must be an integer');
        }

        return value;
    }
}

module.exports = IntegerField;
