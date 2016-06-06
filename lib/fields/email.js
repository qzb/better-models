'use strict'

const validateEmail = require('email-validator').validate
const Field = require('./field')
const StringField = require('./string')

/**
 * A {@link StringField} which checks if value is a valid email.
 *
 * @example
 *      const field = new EmailField()
 *
 *      field.deserialize('SOME.EMAIL@GMAIL.COM') // returns "some.email@gmail.com"
 *      field.deserialize('SOME.EMAIL.GMAIL.COM') // throws validation error
 */
class EmailField extends StringField {
  /**
   * @param {object} [params]
   * @param {boolean} [params.caseSensitive] - disables normalization to lower case
   * @param {boolean} [params.required]
   * @param {string} [params.default]
   */
  constructor (params) { // eslint-disable-line no-useless-constructor
    super(params)
  }

  init (params) {
    super.init(params)
    this.params.trim = true
  }

  deserialize (value) {
    value = super.deserialize(value)

    if (!this.params.caseSensitive) {
      value = value.toLowerCase()
    }

    if (value && !validateEmail(value)) {
      throw new Field.ValidationError('Value must be a valid email address')
    }

    return value
  }
}

module.exports = EmailField
