/* global describe, it */

'use strict'

const expect = require('chai').expect
const Field = require('../../lib/fields/field')

describe('Field', function () {
  describe('constructor', function () {
    it('should create new instance', function () {
      let field = new Field()

      expect(field).to.be.instanceOf(Field)
      expect(field).to.have.property('params')
      expect(field.params).to.be.deep.equal({})
    })

    it('should pass all specified arguments to init method', function () {
      class TestField extends Field {
        init () {
          this.args = Array.prototype.slice.call(arguments)
          super.init.apply(this, arguments)
        }
      }

      let field = new TestField(1, 2, 3)

      expect(field.args).to.be.deep.equal([1, 2, 3])
    })

    it('should freeze params', function () {
      let field = new Field()

      expect(field.params).to.be.frozen
    })

    it('should throw error when default value is invalid', function () {
      class TestField extends Field {
        deserialize () {
          throw new Field.ValidationError('Value is invalid')
        }
      }

      let call = () => new TestField({ default: true })

      expect(call).to.throw(Error, 'Default value is invalid: value is invalid')
    })

    it('should throw error when unexpected error occurs during deserialization of default value', function () {
      let error = new Error()
      class TestField extends Field {
        deserialize () {
          throw error
        }
      }

      let call = () => new TestField({ default: true })

      expect(call).to.throw(error)
    })
  })

  describe('init method', function () {
    it('should copy params to field', function () {
      let params = {
        default: {},
        required: true,
        foo: 'bar'
      }

      let field = {}
      Field.prototype.init.call(field, params)

      expect(field.params).to.be.deep.equal(params)
      expect(field.params).to.be.not.equal(params)
      expect(field.params).to.be.not.frozen
    })
  })

  describe('serialize method', function () {
    it('should return passed value', function () {
      let field = new Field()

      let value = {}
      let result = field.serialize(value)

      expect(result).to.be.equal(value)
    })
  })

  describe('deserialize method', function () {
    it('should return passed value', function () {
      let field = new Field()

      let value = {}
      let result = field.deserialize(value)

      expect(result).to.be.equal(value)
    })
  })

  describe('serializeBlank method', function () {
    it('should return passed value', function () {
      let field = new Field()

      let result = field.serializeBlank()

      expect(result).to.be.null
    })
  })

  describe('deserializeBlank method', function () {
    it('should return null when field is not required', function () {
      let field = new Field()

      let result = field.deserializeBlank()

      expect(result).to.be.null
    })

    it('should return default value when it is specified and field is required', function () {
      let field = new Field({ default: 'lime in the coconut', required: true })

      let result = field.deserializeBlank()

      expect(result).to.be.equal('lime in the coconut')
    })

    it('should return default value when it is specified and field is not required', function () {
      let field = new Field({ default: 'lime in the coconut' })

      let result = field.deserializeBlank()

      expect(result).to.be.equal('lime in the coconut')
    })

    it('should throw error when field is required and there is no default value', function () {
      let field = new Field({ required: true })

      let call = () => field.deserializeBlank()

      expect(call).to.throw(Field.ValidationError, 'Value cannot be empty')
    })

    it('should deserialize default value before returning it', function () {
      let field = new Field({ default: 'lime in the coconut', required: true })
      field.deserialize = () => 'Whoo-whoo-whoo'

      let result = field.deserializeBlank()

      expect(result).to.be.equal('Whoo-whoo-whoo')
    })
  })

  describe('isBlank', function () {
    it('should return true when value is null', function () {
      let field = new Field()
      let result = field.isBlank(null)

      expect(result).to.be.true
    })

    it('should return true when value is undefined', function () {
      let field = new Field()
      let result = field.isBlank(undefined)

      expect(result).to.be.true
    })

    it('should return true when value is empty string', function () {
      let field = new Field()
      let result = field.isBlank('')

      expect(result).to.be.true
    })

    it('should return false when value is empty array', function () {
      let field = new Field()
      let result = field.isBlank([])

      expect(result).to.be.false
    })

    it('should return false when value is empty object', function () {
      let field = new Field()
      let result = field.isBlank({})

      expect(result).to.be.false
    })

    it('should return false when value is false', function () {
      let field = new Field()
      let result = field.isBlank(false)

      expect(result).to.be.false
    })
  })
})
