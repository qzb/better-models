'use strict';

const Field = require('./field');

/**
 * A true/false field. Handles booleans and strings representing booleans. Serializes to boolean.
 *
 * @example
 *      let field = new BooleanField();
 *
 *      field.deserialize(false); // returns false
 *      field.deserialize('yes'); // returns true
 *      field.deserialize('123'); // throws validation error
 */
class BooleanField extends Field {
    /**
     * @param {boolean} params.optional
     * @param {boolean} params.default
     */
    constructor(params) {
        super(params);

        if (this.params.default !== undefined && typeof this.params.default !== 'boolean') {
            throw new Error('Default value must be a boolean');
        }
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

        throw new Error('Value must be a boolean');
    }
}

module.exports = BooleanField;