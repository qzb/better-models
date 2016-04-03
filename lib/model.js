'use strict';

const Field = require('./fields/field');

const SYMBOLS = {
    ERRORS: Symbol('errors'),
    FIELDS: Symbol('fields'),
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

    serialize(opts) {
        let includeProperties = opts && opts.includeProperties;
        let result = {};

        if (includeProperties) {
            for (let key of Object.keys(this)) {
                if (this[key] !== undefined) {
                    result[key] = this[key];
                }
            }
        }

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
        return this.serialize();
    }

    static extend(fields) {
        // Create new class
        let Cls = class extends this {};

        // Copy fields to prototype
        for (let key of Object.keys(fields)) {
            let descriptor = Object.getOwnPropertyDescriptor(fields, key);
            descriptor.enumerable = false;
            Object.defineProperty(Cls.prototype, key, descriptor);
        }

        return Cls;
    }

    static get fields() {
        if (!this.hasOwnProperty(SYMBOLS.FIELDS)) {
            let parent = Object.getPrototypeOf(this.prototype).constructor;
            let fields = {};

            if (parent && parent.fields) {
                fields = Object.assign({}, parent.fields);
            }

            for (let key of Object.getOwnPropertyNames(this.prototype)) {
                let value = Object.getOwnPropertyDescriptor(this.prototype, key).value;

                if (value instanceof Field) {
                    fields[key] = value;
                } else {
                    // In case this property shadows some parent's field
                    delete fields[key];
                }
            }

            Object.defineProperty(this, SYMBOLS.FIELDS, {value: Object.freeze(fields)});
        }

        return this[SYMBOLS.FIELDS];
    }
}

module.exports = Model;
