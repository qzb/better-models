'use strict';

const Field = require('./fields/field');

const SYMBOLS = {
    ERRORS: Symbol('errors'),
    RAW_DATA: Symbol('raw data'),
    OPTIONS: Symbol('options')
};

class Model {
    /**
     * @param data
     * @param [options]
     * @param [options.partial] - if true all missing fields will be skipped during serialization and deserialization
     */
    constructor(data, options) {
        options = Object.freeze(Object.assign({}, options));

        if (this.constructor === Model) {
            throw new Error('You can only create instances of subclasses of Model');
        }

        if (this.constructor.fields == null) {
            throw new Error('Model classes must be created using Model.extend method')
        }

        let result, errors;

        try {
            result = this.constructor.deserialize(data, options) ;
            errors = null;
        } catch (error) {
            if (!(error instanceof Field.ValidationError)) {
                throw error;
            }

            result = null;
            errors = Object.freeze(error.message);
        }

        Object.assign(this, result);

        Object.defineProperty(this, SYMBOLS.OPTIONS, { value: options});
        Object.defineProperty(this, SYMBOLS.ERRORS, { value: errors });
        Object.defineProperty(this, SYMBOLS.RAW_DATA, { value: data });
    }

    toJSON() {
        return this.constructor.serialize(this, this.getOptions());
    }

    /**
     * Returns options passed to constructor.
     *
     * @returns {object}
     */
    getOptions() {
        return this[SYMBOLS.OPTIONS];
    }

    /**
     * Returns raw data passed to constructor.
     *
     * @returns {object}
     */
    getRawData() {
        return this[SYMBOLS.RAW_DATA];
    }

    /**
     * Returns errors which occurred during deserialization.
     *
     * @returns {object|null}
     */
    getErrors() {
        return this[SYMBOLS.ERRORS];
    }

    /**
     * Deserializes provided data. It returns plain object instead instance of Model. Unlike model's constructor it
     * throws error when provided data isn't valid.
     *
     * @param {object} data
     * @param {object} [options]
     * @throws {ValidationError} - error containing all errors which occurred during deserialization.
     * @returns {object}
     */
    static deserialize(data, options) {
        options = options || {};

        const result = {};
        const errors = {};

        // Deserialize values
        for (const key of Object.keys(this.fields)) {
            const field = this.fields[key];
            const value = data[key];

            try {
                if (field.isBlank(value)) {
                    if (!options.partial) {
                        result[key] = field.deserializeBlank(options);
                    }
                } else {
                    result[key] = field.deserialize(value, options);
                }
            } catch (error) {
                if (error instanceof Field.ValidationError) {
                    result[key] = null;
                    errors[key] = error.message;
                } else {
                    throw error;
                }
            }
        }

        if (Object.keys(errors).length !== 0) {
            throw new Field.ValidationError(errors);
        }

        return result;
    }

    /**
     * Serializes provided data.
     *
     * @param {object} data
     * @param {object} [options]
     * @returns {{}}
     */
    static serialize(data, options) {
        options = options || {};

        const result = {};

        for (const key of Object.keys(this.fields)) {
            const field = this.fields[key];
            const value = data[key];

            if (field.isBlank(value)) {
                if (!options.partial) {
                    result[key] = field.serializeBlank(options);
                }
            } else {
                result[key] = field.serialize(value, options);
            }
        }

        return result;
    }

    /**
     * Creates subclass of Model using provided fields.
     *
     * @param {object} fields - object containing fields
     * @returns {function}
     */
    static extend(fields) {
        // Create new class
        const Cls = class extends this {};

        // Create fields property
        Cls.fields = Object.assign({}, this.fields);

        // Copy fields to fields property
        for (const key of Object.keys(fields)) {
            if (fields[key] instanceof Field) {
                Cls.fields[key] = fields[key];
            } else {
                throw new Error('All properties passed to extend method must be instances of Field class');
            }
        }

        // Freeze fields property
        Object.freeze(Cls.fields);

        return Cls;
    }
}

module.exports = Model;
