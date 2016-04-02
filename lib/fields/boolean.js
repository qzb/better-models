'use strict';

const Field = require('./field');

class BooleanField extends Field {
    constructor(params) {
        params = params || {};

        super();

        if (params.default !== undefined && typeof params.default !== 'boolean') {
            throw new Error('Default value must be a boolean');
        }

        this.params = {};
        this.params.default = params.default;
        this.params.blank = params.blank;
    }

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