'use strict';

const Field = require('./fields/field');

const SYMBOLS = {
    ERRORS: Symbol('errors'),
    RAW_DATA: Symbol('raw data')
};

class Model {
    constructor(data) {
        if (this.constructor === Model) {
            throw new Error('You can only create instances of subclasses of Model');
        }

        let errors = {};

        // Deserialize values
        for (let key of Object.keys(this.constructor.fields)) {
            let field = this.constructor.fields[key];
            let value = data[key];

            try {
                if (field.isBlank(value)) {
                    this[key] = field.deserializeBlank(value);
                } else {
                    this[key] = field.deserialize(value);
                }
            } catch (error) {
                if (error instanceof Field.ValidationError) {
                    this[key] = null;
                    errors[key] = error.message;
                } else {
                    throw error;
                }
            }
        }

        if (Object.keys(errors).length === 0) {
            errors = null;
        }

        Object.defineProperty(this, SYMBOLS.ERRORS, { value: Object.freeze(errors) });
        Object.defineProperty(this, SYMBOLS.RAW_DATA, { value: data });
    }

    getErrors() {
        return this[SYMBOLS.ERRORS];
    }

    getRawData() {
        return this[SYMBOLS.RAW_DATA];
    }

    serialize() {
        let result = {};

        for (let key of Object.keys(this.constructor.fields)) {
            let field = this.constructor.fields[key];
            let value = this[key];

            if (field.isBlank(value)) {
                result[key] = field.serializeBlank(value);
            } else {
                result[key] = field.serialize(value);
            }
        }

        return result;
    }

    toJSON() {
        return this.serialize.apply(this, arguments);
    }

    static extend(fields) {
        // Create new class
        let Cls = class extends this {};

        // Create fields property
        Cls.fields = Object.assign({}, this.fields);

        // Copy fields to fields property
        for (let key of Object.keys(fields)) {
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
