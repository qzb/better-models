'use strict';

const Field = require('./field');

/**
 * A true/false field. Handles booleans and strings representing booleans. Serializes to boolean.
 *
 * @example
 *      const field = new BooleanField();
 *
 *      field.deserialize(false); // returns false
 *      field.deserialize('yes'); // returns true
 *      field.deserialize('123'); // throws validation error
 */
class BooleanField extends Field {
    /**
     * @param {object} [params]
     * @param {boolean} [params.optional]
     * @param {boolean} [params.default]
     */
    constructor(params) {
        super(params);
    }

    /**
     * @returns {boolean}
     */
    deserialize(value) {
        if (typeof value === 'boolean') {
            return value;
        }

        if (typeof value === 'string') {
            if (value.match(/^(y|Y|yes|Yes|YES|true|True|TRUE|on|On|ON)$/)) {
                return true;
            }

            if (value.match(/^(n|N|no|No|NO|false|False|FALSE|off|Off|OFF)$/)) {
                return false;
            }
        }

        throw new Field.ValidationError('Value must be a boolean');
    }
}

module.exports = BooleanField;