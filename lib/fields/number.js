'use strict'

const Field = require('./field')

/**
 * A number field. Accepts double precision real numbers.
 *
 * @example
 *      const field = new StringField({ maxLength: 3 })
 *
 *      field.deserialize('123.4')  // returns 123.4
 *      field.deserialize(123.4)    // returns 123.4
 *      field.deserialize('123.4a') // throws validation error
 *      field.deserialize(1e+999)   // throws validation error
 *      field.deserialize(NaN)      // throws validation error
 */
class NumberField extends Field {
  /**
   * @param {object} [params]
   * @param {number} [params.min] - minimum value
   * @param {number} [params.max] - maximum value
   * @param {boolean} [params.required]
   * @param {number} [params.default]
   */
  constructor (params) { // eslint-disable-line no-useless-constructor
    super(params)
  }

  init (params) {
    super.init(params)

    if (this.params.min !== undefined && !Number.isFinite(this.params.min)) {
      throw new Error('Min value must be a number')
    }

    if (this.params.max !== undefined && !Number.isFinite(this.params.max)) {
      throw new Error('Max value must be a number')
    }

    if (this.params.max < this.params.min) {
      throw new Error('Max value must be greater than min value')
    }
  }

  deserialize (value) {
    // It's more strict than parseFloat. It will convert values like '12aaa' to NaN.
    if (typeof value === 'string') {
      value = Number(value)
    }

    // It will throw exception on Infinity and NaN
    if (!Number.isFinite(value)) {
      throw new Field.ValidationError('Value must be a number')
    }

    if (this.params.min !== undefined && value < this.params.min) {
      throw new Field.ValidationError(`Value cannot be less than ${this.params.min}`)
    }

    if (this.params.max !== undefined && value > this.params.max) {
      throw new Field.ValidationError(`Value cannot be greater than ${this.params.max}`)
    }

    return value
  }
}

module.exports = NumberField
