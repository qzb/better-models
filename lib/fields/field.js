'use strict';

class Field {
    constructor(params) {
        this.params = Object.freeze(Object.assign({}, params));
    }

    serialize(value) {
       return value;
    }

    deserialize(value) {
       return value;
    }

    isBlank(value) {
        return ( value === null || value === undefined || value === '' );
    }

    serializeBlank() {
        return null;
    }

    deserializeBlank() {
        if (this.params.default !== undefined) {
            return this.params.default;
        }

        if (this.params.blank) {
            return null;
        }

        throw 'Value cannot be empty';
    }
}

module.exports = Field;