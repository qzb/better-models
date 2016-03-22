'use strict';

const Field = require('./fields/field');

const SYMBOLS = {
    ERRORS: Symbol('errors'),
    FIELDS: Symbol('fields'),
    RAW_DATA: Symbol('raw data')
};

function _getAllProperties(obj) {
    let props = new Set();

    while (obj) {
        Object.getOwnPropertyNames(obj).forEach(p => props.add(p));
        obj = Object.getPrototypeOf(obj);
    }

    return props;
}

class Model {
    constructor(data) {
        if (this.constructor === Model) {
            throw new Error('You can only create instances of subclasses of Model');
        }

        let fields = {};
        let errors = {};

        // Prepare list of all fields in this Model
        for (let key in this) {
            if (this[key] instanceof Field) {
                fields[key] = this[key];
            }
        }

        // Deserialize values
        for (let key of Object.keys(fields)) {
           try {
               this[key] = fields[key].deserialize(data[key]);
           } catch (error) {
               this[key] = null;
               errors[key] = error.message || error;
           }
        }

        if (Object.keys(errors).length === 0) {
            errors = null;
        }

        Object.defineProperty(this, SYMBOLS.FIELDS, { value: Object.freeze(fields) });
        Object.defineProperty(this, SYMBOLS.ERRORS, { value: Object.freeze(errors) });
        Object.defineProperty(this, SYMBOLS.RAW_DATA, { value: data });
    }

    getErrors() {
        return this[SYMBOLS.ERRORS];
    }

    getRawData() {
        return this[SYMBOLS.RAW_DATA];
    }

    toJSON() {
        let result = {};

        for (let key of _getAllProperties(this)) {
            if (typeof this[key] !== 'function' && key !== '__proto__') {
                result[key] = this[key];
            }
        }

        for (let key of Object.keys(this[SYMBOLS.FIELDS])) {
            result[key] = this[SYMBOLS.FIELDS][key].serialize(this[key]);
        }

        return result;
    }

    static extend(fields) {
        // Create new class
        let Cls = class extends this {};

        // Copy fields to prototype
        for (let key of Object.keys(fields)) {
            let descriptor = Object.getOwnPropertyDescriptor(fields, key);
            Object.defineProperty(Cls.prototype, key, descriptor);
        }

        return Cls;
    }
}

module.exports = Model;
