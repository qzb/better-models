'use strict';

const Field = require('./field');

/**
 * An object field. It uses provided field for properties validation and serialization.
 *
 * @example
 *      let field = new ObjectField(new IntegerField());
 *
 *      field.deserialize({ foo: 1, bar: '2.0' });      // returns { foo: 1, bar: 2 }
 *      field.deserialize({ foo: 'bar' });              // throws validation error
 */
class ObjectField extends Field {
    /**
     * @param {object} field - field which will be used to serialize/deserialize objects's properties
     * @param {object} [params]
     * @param {boolean} [params.optional]
     * @param {array} [params.default]
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

    /**
     * @returns {object}
     */
    deserialize(value) {
        if (typeof value !== 'object') {
            throw new Field.ValidationError('Value must be an object');
        }

        let result = {};
        let errors = {};
        let errorOccurred = false;

        for (let key of Object.keys(value)) {
            try {
                result[key] = this.field.deserialize(value[key]);
            } catch (error) {
                if (!(error instanceof Field.ValidationError)) {
                    throw error;
                }

                errorOccurred = true;
                errors[key] = error.message;
            }
        }

        if (errorOccurred) {
            throw new Field.ValidationError(errors);
        }

        return result;
    }

    /**
     * @returns {object}
     */
    serialize(value) {
        let result = {};

        for (let key of Object.keys(value)) {
            result[key] = this.field.serialize(value[key]);
        }

        return result;
    }
}

module.exports = ObjectField;