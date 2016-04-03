'use strict';

/**
 * Generic field class. Every other field class must inherit from this one.
 */
class Field {
    /**
     * @param {object} params
     * @param {boolean} params.optional
     * @param {*} params.default
     */
    constructor(params) {
        this.params = Object.freeze(Object.assign({}, params));
    }

    /**
     * Serializes non-blank values.
     *
     * @param value
     * @returns {*}
     */
    serialize(value) {
       return value;
    }

    /**
     * Deserializes non-blank values.
     *
     * @param value
     * @returns {*}
     */
    deserialize(value) {
       return value;
    }

    /**
     * Checks if provided value should handled by (de)serialize or (de)serializeBlank method.
     *
     * @param value
     * @returns {boolean}
     */
    isBlank(value) {
        return ( value === null || value === undefined || value === '' );
    }

    /**
     * Serializes blank values (by default null, undefined and empty string).
     *
     * @returns {null}
     */
    serializeBlank() {
        return null;
    }

    /**
     * Deserializes blank values (by default null, undefined and empty string).
     *
     * @returns {*}
     */
    deserializeBlank() {
        if (this.params.default !== undefined) {
            return this.params.default;
        }

        if (this.params.optional) {
            return null;
        }

        throw 'Value cannot be empty';
    }
}

module.exports = Field;