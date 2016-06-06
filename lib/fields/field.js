'use strict'

const customError = require('custom-error')

/**
 * Generic field class. Every other field class must inherit from this one.
 */
class Field {
  constructor () {
    this.init.apply(this, arguments)

    // Validate default value

    if (this.params.default !== undefined) {
      try {
        this.deserialize(this.params.default)
      } catch (error) {
        if (error instanceof Field.ValidationError) {
          throw new Error(`Default value is invalid: ${error.message.toLowerCase()}`)
        } else {
          throw error
        }
      }
    }

    // Freeze params

    Object.freeze(this.params)
  }

  /**
   * Initializes field's instance. It should be carried out by constructor but unfortunately ES6 specification
   * forbides referring to `this` before calling super. It makes impossible to validate default values by calling
   * deserialize method in constructor. To workaround this behaviour actual initialization is made by init function
   * and constructor is responsible only for validation of default value and freezing params.
   *
   * @param params
   */
  init (params) {
    this.params = Object.assign({}, params)
  }

  /**
   * Serializes non-blank values.
   *
   * @param {*} value
   * @param {object} [options]
   * @returns {*}
   */
  serialize (value, options) {
    return value
  }

  /**
   * Deserializes non-blank values.
   *
   * @param {*} value
   * @param {object} [options]
   * @returns {*}
   */
  deserialize (value, options) {
    return value
  }

  /**
   * Checks if provided value should handled by (de)serialize or (de)serializeBlank method.
   *
   * @param {*} value
   * @returns {boolean}
   */
  isBlank (value) {
    return (value === null || value === undefined || value === '')
  }

  /**
   * Serializes blank values (by default null, undefined and empty string).
   *
   * @param {object} [options]
   * @returns {null}
   */
  serializeBlank (options) {
    return null
  }

  /**
   * Deserializes blank values (by default null, undefined and empty string).
   *
   * @param {object} [options]
   * @returns {*}
   */
  deserializeBlank (options) {
    if (this.params.default !== undefined) {
      return this.params.default
    }

    if (this.params.required) {
      throw new Field.ValidationError('Value cannot be empty')
    }

    return null
  }
}

Field.ValidationError = customError('ValidationError')

module.exports = Field
