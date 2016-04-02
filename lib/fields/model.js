'use strict';

const Model = require('../model');
const Field = require('./field');

class ModelField extends Field {
    constructor(FieldModel, params) {
        params = params || {};

        super();

        if (!FieldModel) {
            throw new Error('Model is missing');
        }

        if (typeof FieldModel === 'object') {
            FieldModel = Model.extend(FieldModel);
        }

        if (params.default !== undefined) {
            throw new Error('This field doesn\'t accept default value');
        }

        this.Model = FieldModel;
        this.params = {};
        this.params.blank = params.blank;
    }

    deserialize(value) {
        if (typeof value !== 'object') {
            throw 'Value must be an object';
        }

        value = new this.Model(value);

        let errors = value.getErrors();

        if (errors) {
            let firstErrorKey = Object.keys(errors)[0];
            throw new Error(firstErrorKey + ': ' + errors[firstErrorKey]);
        }

        return value;
    }
}

module.exports = ModelField;