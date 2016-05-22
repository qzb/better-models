'use strict';

const Field = require('./field');

/**
 * An array field. It uses provided field for data validation and serialization.
 *
 * @example
 *      const field = new ArrayField(new IntegerField());
 *
 *      field.deserialize([ 1, '2', '3.0' ]);        // returns [ 1, 2, 3 ]
 *      field.deserialize([ 'foo', 'bar' ]);         // throws validation error
 */
class ArrayField extends Field {
    /**
     * @param {object} field - field which will be used to serialize/deserialize array's elements
     * @param {object} [params]
     * @param {boolean} [params.required]
     * @param {array} [params.default]
     * @param {number} [params.minLength] - minimum length of array
     * @param {number} [params.maxLength] - maximum length of array
     */
    constructor(field, params) {
        super(field, params);
    }

    init(field, params) {
        super.init(params);

        if (!field) {
            throw new Error('Field is missing');
        }

        this.field = field;
    }

    deserialize(value, options) {
        if (Array.isArray(value) === false) {
            throw new Field.ValidationError('Value must be an array');
        }

        if (this.params.minLength !== undefined && value.length < this.params.minLength) {
            throw new Field.ValidationError(`Value must have at least ${this.params.minLength} elements`);
        }

        if (this.params.maxLength !== undefined && value.length > this.params.maxLength) {
            throw new Field.ValidationError(`Value must have at most ${this.params.maxLength} elements`);
        }

        const result = [];
        const errors = {};
        let errorOccurred = false;

        for (let i = 0; i < value.length; ++i) {
            try {
                result.push(this.field.deserialize(value[i], options));
            } catch (error) {
                if (!(error instanceof Field.ValidationError)) {
                    throw error;
                }

                errorOccurred = true;
                errors[i] = error.message;
            }
        }

        if (errorOccurred) {
            throw new Field.ValidationError(errors);
        }

        return result;
    }

    serialize(value, options) {
        return value.map(e => this.field.serialize(e, options));
    }
}

module.exports = ArrayField;