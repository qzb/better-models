'use strict'

const chai = require('chai')
const expect = require('chai').expect
const spies = require('chai-spies')
const Field = require('../../lib/fields/field')
const ArrayField = require('../../lib/fields/array')

chai.use(spies)

describe('ArrayField', function() {
    describe('constructor', function() {
        it('should create new instance of field using specified field', function() {
            const field = new Field()
            const arrayField = new ArrayField(field)

            expect(arrayField).to.be.instanceOf(Field)
            expect(arrayField).to.be.instanceOf(ArrayField)
            expect(arrayField).to.have.property('field', field)
        })

        it('should create new instance of field when all params are specified', function () {
            const field = new ArrayField(new Field(), {
                default: [ 1, 2 ],
                required: true,
                minLength: 1,
                maxLength: 2
            })

            expect(field).to.be.instanceOf(Field)
            expect(field).to.be.instanceOf(ArrayField)
        })

        it('should throw error when field is not specified', function() {
            const call = () => new ArrayField()

            expect(call).to.throw('Field is missing')
        })
    })

    describe('deserialize method', function () {
        it('should deserialize value', function() {
            class CustomField extends Field {
                deserialize() { return true }
            }

            const field = new ArrayField(new CustomField())

            const result = field.deserialize([ 1, 2 ])

            expect(result).to.be.deep.equal([ true, true ])
        })

        it('should deserialize empty array', function () {
            const field = new ArrayField(new Field())

            const result = field.deserialize([])

            expect(result).to.be.deep.equal([])
        })

        it('should throw error when value is not an array', function() {
            const field = new ArrayField(new Field())

            const call = () => field.deserialize(123)

            expect(call).to.throw(Field.ValidationError, 'Value must be an array')
        })

        it('should throw error when any of array\'s values are not valid according to specified field', function() {
            class InvalidField extends Field {
                deserialize(v) { throw new Field.ValidationError(v) }
            }

            const field = new ArrayField(new InvalidField())

            try {
                field.deserialize([ 1, 2 ])
            } catch (error) {
                expect(error).to.be.instanceOf(Field.ValidationError)
                expect(error.message).to.have.property('0', 1)
                expect(error.message).to.have.property('1', 2)
            }
        })

        it('should not intercept errors other than ValidationError', function () {
            const error = new Error()

            class InvalidField extends Field {
                deserialize(v) { throw error }
            }

            const field = new ArrayField(new InvalidField())

            const call = () => field.deserialize([ 1 ])

            expect(call).to.throw(error)
        })

        it('should throw error array\'s length is less than min length', function() {
            const field = new ArrayField(new Field(), { minLength: 2 })

            const call = () => field.deserialize([ 1 ])

            expect(call).to.throw(Field.ValidationError, 'Value must have at least 2 elements')
        })

        it('should throw when array\'s length is greater than than max length', function() {
            const field = new ArrayField(new Field(), { maxLength: 2 })

            const call = () => field.deserialize([ 1, 2, 3 ])

            expect(call).to.throw(Field.ValidationError, 'Value must have at most 2 elements')
        })

        it('should not throw when array\'s length is less than or equal to max length', function() {
            const field = new ArrayField(new Field(), { maxLength: 2 })

            const call1 = () => field.deserialize([ 1, 2 ])
            const call2 = () => field.deserialize([ 1 ])

            expect(call1).to.not.throw()
            expect(call2).to.not.throw()
        })

        it('should not throw when array\'s length is greater than or equal to min length', function() {
            const field = new ArrayField(new Field(), { minLength: 2 })

            const call1 = () => field.deserialize([ 1, 2, 3 ])
            const call2 = () => field.deserialize([ 1, 2 ])

            expect(call1).to.not.throw()
            expect(call2).to.not.throw()
        })

        it('should pass specified options to child-field\'s deserialize method', function () {
            const childField = new Field()
            const arrayField = new ArrayField(childField)

            childField.deserialize = chai.spy()

            const opts = { option: 'option' }

            arrayField.deserialize([ 1 ], opts)

            expect(childField.deserialize).to.have.been.called.with.exactly(1, opts)
        })
    })

    describe('serialize method', function () {
        it('should serialize value', function () {
            class CustomField extends Field {
                serialize() { return true }
            }

            const field = new ArrayField(new CustomField())

            const result = field.serialize([ 1, 2 ])

            expect(result).to.be.deep.equal([ true, true ])
        })

        it('should deserialize empty array', function () {
            const field = new ArrayField(new Field())

            const result = field.serialize([])

            expect(result).to.be.deep.equal([])
        })

        it('should pass specified options to child-field\'s serialize method', function () {
            const childField = new Field()
            const arrayField = new ArrayField(childField)

            childField.serialize = chai.spy()

            const opts = { option: 'option' }

            arrayField.serialize([ 1 ], opts)

            expect(childField.serialize).to.have.been.called.with.exactly(1, opts)
        })
    })
})

