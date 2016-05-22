/* global describe, it */
'use strict'

const expect = require('chai').expect
const Field = require('../../lib/fields/field')
const EmailField = require('../../lib/fields/email')

describe('EmailField', function () {
    describe('constructor', function () {
        it('should create new instance of field', function () {
            const field = new EmailField()

            expect(field).to.be.instanceOf(Field)
            expect(field).to.be.instanceOf(EmailField)
        })

        it('should create new instance of field when all params are specified', function () {
            const field = new EmailField({
                default: 'test@dev.null',
                required: true,
                caseSensitive: true
            })

            expect(field).to.be.instanceOf(Field)
            expect(field).to.be.instanceOf(EmailField)
        })
    })

    describe('deserialize method', function () {
        it('should deserialize valid email address', function () {
            const field = new EmailField({})
            const result = field.deserialize('test+siabadaba@gmail.com')

            expect(result).to.be.equal('test+siabadaba@gmail.com')
        })

        it('should trim value', function () {
            const field = new EmailField({})
            const result = field.deserialize('   test+siabadaba@gmail.com \t\r\n')

            expect(result).to.be.equal('test+siabadaba@gmail.com')
        })

        it('should lowercase value', function () {
            const field = new EmailField({})
            const result = field.deserialize('TeSt@sIaBaDaBa.cOm')

            expect(result).to.be.equal('test@siabadaba.com')
        })

        it('shouldn\'t lowercase value when caseSensitive option is enabled', function () {
            const field = new EmailField({ caseSensitive: true })
            const result = field.deserialize('TeSt@sIaBaDaBa.cOm')

            expect(result).to.be.equal('TeSt@sIaBaDaBa.cOm')
        })

        it('should throw error when value isn\'t a valid email address', function () {
            const field = new EmailField({})
            const call = () => field.deserialize('.test+siabadaba@.gmail.com')

            expect(call).to.throw(Field.ValidationError, 'Value must be a valid email address')
        })

        it('should throw error when value isn\'t a string', function () {
            const field = new EmailField({})
            const call = () => field.deserialize(123)

            expect(call).to.throw(Field.ValidationError, 'Value must be a string')
        })
    })
})
