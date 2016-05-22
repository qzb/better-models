'use strict'

const Model = require('../model')
const Field = require('./field')

/**
 * An object field. It uses provided model for data validation and serialization.
 *
 * @example
 *      const field = new ModelField({
 *          id:   new IntegerField(),
 *          name: new StringField({ default: 'abc' })
 *      })
 *
 *      field.deserialize({ id: '7', foo: 'bar' })  // returns { id: 7, name: 'abc' }
 *      field.deserialize({ foo: 'bar' })           // throws validation error
 */
class ModelField extends Field {
    /**
     * @param {object|function} model - model which will be used to serialize/deserialize object's properties
     * @param {object} [params]
     * @param {boolean} [params.required]
     * @param {boolean} [params.default]
     */
    constructor(model, params) {
        super(model, params)
    }

    init(model, params) {
        super.init(params)

        if (!model) {
            throw new Error('Model is missing')
        }

        if (typeof model === 'object') {
            model = Model.extend(model)
        }

        this.Model = model
    }

    deserialize(value, options) {
        if (typeof value !== 'object') {
            throw new Field.ValidationError('Value must be an object')
        }

        return this.Model.deserialize(value, options)
    }

    serialize(value, options) {
        return this.Model.serialize(value, options)
    }
}

module.exports = ModelField;