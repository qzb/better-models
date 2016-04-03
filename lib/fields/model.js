'use strict';

const Model = require('../model');
const Field = require('./field');

/**
 * An object field. It uses provided model for data validation and serialization.
 *
 * @example
 *      let field = new ModelField({
 *          id:   new IntegerField(),
 *          name: new StringField({ default: 'abc' })
 *      });
 *
 *      field.deserialize({ id: '7', foo: 'bar' });  // returns { id: 7, name: 'abc' }
 *      field.deserialize({ foo: 'bar' });           // throws validation error
 */
class ModelField extends Field {
    /**
     * @param {boolean} params.optional
     */
    constructor(FieldModel, params) {
        super(params);

        if (!FieldModel) {
            throw new Error('Model is missing');
        }

        if (typeof FieldModel === 'object') {
            FieldModel = Model.extend(FieldModel);
        }

        if (this.params.default !== undefined) {
            throw new Error('This field doesn\'t accept default value');
        }

        this.Model = FieldModel;
    }

    /**
     * @returns {object}
     */
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