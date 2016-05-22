'use strict'

const chai = require('chai')
const expect = require('chai').expect
const spies = require('chai-spies')
const Model = require('../../lib/model')
const Field = require('../../lib/fields/field')
const ModelField = require('../../lib/fields/model')

chai.use(spies)

describe('ModelField', function() {
    describe('constructor', function() {
        it('should create new instance of field using specified model', function() {
            const CustomModel = Model.extend({})
            const field = new ModelField(CustomModel)

            expect(field).to.be.instanceOf(Field)
            expect(field).to.be.instanceOf(ModelField)
            expect(field).to.have.property('Model', CustomModel)
        })

        it('should create new instance of field using specified object to create a new model', function () {
            const field = new Field()
            const modelField = new ModelField({ field })

            expect(modelField).to.be.instanceOf(Field)
            expect(modelField).to.be.instanceOf(ModelField)
            expect(modelField).to.have.deep.property('Model.fields.field', field)
        })

        it('should create new instance of field when all params are specified', function () {
            const field = new ModelField({}, {
                default: {},
                required: true
            })

            expect(field).to.be.instanceOf(Field)
            expect(field).to.be.instanceOf(ModelField)
        })

        it('should throw error when model is not specified', function() {
            const call = () => new ModelField()

            expect(call).to.throw(Error, 'Model is missing')
        })
    })

    describe('deserialize method', function () {
        it('should deserialize value', function() {
            const field = new ModelField({ foo: new Field() })
            const result = field.deserialize({ foo: 123, bar: 456 })

            expect(result).to.be.not.an.instanceOf(Model)
            expect(result).to.be.deep.equal({ foo: 123 })
        })

        it('should throw error when value is not an object', function() {
            const field = new ModelField({ foo: new Field() })
            const call = () => field.deserialize(123)

            expect(call).to.throw(Field.ValidationError, 'Value must be an object')
        })

        it('should throw error when value isn\'t valid according to field\'s model', function() {
            class InvalidField extends Field {
                deserialize() {
                    throw new Field.ValidationError(this.params.msg)
                }
            }

            const field = new ModelField({
                foo: new InvalidField({ msg: 'bar' }),
                egg: new InvalidField({ msg: 'spam' })
            })

            try {
                field.deserialize({ foo: true, egg: true })
            } catch (error) {
                expect(error).to.be.instanceOf(Field.ValidationError)
                expect(error.message).to.have.property('foo', 'bar')
                expect(error.message).to.have.property('egg', 'spam')
            }
        })

        it('should pass specified options to model\'s deserialize method', function () {
            const field = new ModelField({})
            const data = { foo: 'bar' }
            const opts = { option: 'option' }

            field.Model.deserialize = chai.spy()

            field.deserialize(data, opts)

            expect(field.Model.deserialize).to.have.been.called.with.exactly(data, opts)
        })
    })

    describe('serialize method', function () {
        it('should serialize value', function () {
            class CustomField extends Field {
                serialize(value) {
                    return !value
                }
            }

            const field = new ModelField({
                foo: new CustomField()
            })

            const result = field.serialize({
                foo: false
            })

            expect(result).to.be.deep.equal({ foo: true })
        })

        it('should pass specified options to model\'s serialize method', function () {
            const field = new ModelField({})
            const data = { foo: 'bar' }
            const opts = { option: 'option' }

            field.Model.serialize = chai.spy()

            field.serialize(data, opts)

            expect(field.Model.serialize).to.have.been.called.with.exactly(data, opts)
        })
    })
})

