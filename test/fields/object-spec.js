/* global describe, it */

'use strict'

const chai = require('chai')
const expect = require('chai').expect
const spies = require('chai-spies')
const Field = require('../../lib/fields/field')
const ObjectField = require('../../lib/fields/object')

chai.use(spies)

describe('ObjectField', function () {
  describe('constructor', function () {
    it('should create new instance of field using specified field', function () {
      const field = new Field()
      const objectField = new ObjectField(field)

      expect(objectField).to.be.instanceOf(Field)
      expect(objectField).to.be.instanceOf(ObjectField)
      expect(objectField).to.have.property('field', field)
    })

    it('should create new instance of field when all params are specified', function () {
      const field = new ObjectField(new Field(), {
        default: { foo: 'bar' },
        required: true
      })

      expect(field).to.be.instanceOf(Field)
      expect(field).to.be.instanceOf(ObjectField)
    })

    it('should throw error when field is not specified', function () {
      const call = () => new ObjectField()

      expect(call).to.throw('Field is missing')
    })
  })

  describe('deserialize method', function () {
    it('should deserialize value', function () {
      class CustomField extends Field {
        deserialize () { return true }
      }

      const field = new ObjectField(new CustomField())

      const result = field.deserialize({ foo: 1, bar: 2 })

      expect(result).to.be.deep.equal({ foo: true, bar: true })
    })

    it('should deserialize empty object', function () {
      const field = new ObjectField(new Field())

      const result = field.deserialize({})

      expect(result).to.be.deep.equal({})
    })

    it('should throw error when value is not an object', function () {
      const field = new ObjectField(new Field())

      const call = () => field.deserialize(123)

      expect(call).to.throw(Field.ValidationError, 'Value must be an object')
    })

    it("should throw error when any of objects's fields are not valid according to specified field", function () {
      class InvalidField extends Field {
        deserialize (v) { throw new Field.ValidationError(v) }
      }

      const field = new ObjectField(new InvalidField())

      try {
        field.deserialize({ foo: 1, bar: 2 })
      } catch (error) {
        expect(error).to.be.instanceOf(Field.ValidationError)
        expect(error.message).to.have.property('foo', 1)
        expect(error.message).to.have.property('bar', 2)
      }
    })

    it('should not intercept errors other than ValidationError', function () {
      const error = new Error()

      class InvalidField extends Field {
        deserialize (v) { throw error }
      }

      const field = new ObjectField(new InvalidField())

      const call = () => field.deserialize({ foo: 'bar' })

      expect(call).to.throw(error)
    })

    it("should pass specified options to child-field's deserialize method", function () {
      const childField = new Field()
      const objectField = new ObjectField(childField)

      childField.deserialize = chai.spy()

      const opts = { option: 'option' }

      objectField.deserialize({ foo: 'bar' }, opts)

      expect(childField.deserialize).to.have.been.called.with.exactly('bar', opts)
    })
  })

  describe('serialize method', function () {
    it('should serialize value', function () {
      class CustomField extends Field {
        serialize () { return true }
      }

      const field = new ObjectField(new CustomField())

      const result = field.serialize({ foo: false, bar: false })

      expect(result).to.be.deep.equal({ foo: true, bar: true })
    })

    it('should deserialize empty object', function () {
      const field = new ObjectField(new Field())

      const result = field.serialize({})

      expect(result).to.be.deep.equal({})
    })

    it("should pass specified options to child-field's serialize method", function () {
      const childField = new Field()
      const objectField = new ObjectField(childField)

      childField.serialize = chai.spy()

      const opts = { option: 'option' }

      objectField.serialize({ foo: 'bar' }, opts)

      expect(childField.serialize).to.have.been.called.with.exactly('bar', opts)
    })
  })
})
