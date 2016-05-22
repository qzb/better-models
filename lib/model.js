'use strict';

const Field = require('./fields/field');

const SYMBOLS = {
    ERRORS: Symbol('errors'),
    RAW_DATA: Symbol('raw data'),
    OPTIONS: Symbol('options')
};

class Model {
    constructor(data, options) {
        options = Object.freeze(Object.assign({}, options));

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
                    if (!options.partial) {
                        this[key] = field.deserializeBlank(options);
                    }
                } else {
                    this[key] = field.deserialize(value, options);
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

        errors = Object.freeze(errors);

        Object.defineProperty(this, SYMBOLS.OPTIONS, { value: options});
        Object.defineProperty(this, SYMBOLS.ERRORS, { value: errors });
        Object.defineProperty(this, SYMBOLS.RAW_DATA, { value: data });
    }

    getOptions() {
        return this[SYMBOLS.OPTIONS];
    }

    getErrors() {
        return this[SYMBOLS.ERRORS];
    }

    getRawData() {
        return this[SYMBOLS.RAW_DATA];
    }

    serialize() {
        let options = this.getOptions();
        let result = {};

        for (let key of Object.keys(this.constructor.fields)) {
            let field = this.constructor.fields[key];
            let value = this[key];

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
