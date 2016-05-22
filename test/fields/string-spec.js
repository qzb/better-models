/* global describe, it */
'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const StringField = require('../../lib/fields/string');

describe('StringField', function () {
    describe('constructor', function () {
        it('should create new instance of field', function () {
            const field = new StringField();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(StringField);
        });

        it('should create new instance of field when all params are specified', function () {
            const field = new StringField({
                default: 'a b c d e f g',
                required: true,
                trim: true,
                maxLength: 100,
                minLength: 10
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(StringField);
        });

        it('should throw error when min length isn\'t an integer', function () {
            const call = () => new StringField({ minLength: 7.000001 });

            expect(call).to.throw(Error, 'Min length must be a positive integer');
        });

        it('should throw error when min length is negative', function () {
            const call = () => new StringField({ minLength: -1 });

            expect(call).to.throw(Error, 'Min length must be a positive integer');
        });

        it('should throw error when max length isn\'t an integer', function () {
            const call = () => new StringField({ maxLength: 5.55555 });

            expect(call).to.throw(Error, 'Max length must be a positive integer');
        });

        it('should throw error when max length is negative', function () {
            const call = () => new StringField({ maxLength: -1 });

            expect(call).to.throw(Error, 'Max length must be a positive integer');
        });

        it('should throw error when min length value is greater than max length value', function () {
            const call = () => new StringField({ maxLength: 10, minLength: 100 });

            expect(call).to.throw(Error, 'Max length must be greater than min length');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize string', function () {
            const field = new StringField({});
            const result = field.deserialize('123456');

            expect(result).to.be.equal('123456');
        });

        it('should trim value when trim option is enabled', function () {
            const field = new StringField({ trim: true });
            const result = field.deserialize('  123456   ');

            expect(result).to.be.equal('123456');
        });

        it('shouldn\'t trim value when trim option is disabled', function () {
            const field = new StringField({});
            const result = field.deserialize('  123456   ');

            expect(result).to.be.equal('  123456   ');
        });

        it('should throw error when field is required and value is empty after trimming', function () {
            const field = new StringField({ trim: true, required: true });
            const call = () => field.deserialize(' \t\n\r');

            expect(call).to.throw(Field.ValidationError, 'Value cannot be empty');
        });

        it('should throw error when value is not a string', function () {
            const field = new StringField({});
            const call = () => field.deserialize(false);

            expect(call).to.throw(Field.ValidationError, 'Value must be a string');
        });

        it('should throw error when value\'s length is greater than max length', function () {
            const field = new StringField({ maxLength: 5 });
            const call = () => field.deserialize('123456');

            expect(call).to.throw(Field.ValidationError, 'Value\'s length cannot be greater than 5');
        });

        it('should throw error when value\'s length is less than min length', function () {
            const field = new StringField({ minLength: 5 });
            const call = () => field.deserialize('1234');

            expect(call).to.throw(Field.ValidationError, 'Value\'s length cannot be less than 5');
        });

        it('shouldn\'t throw error when value\'s length is equal to max length', function () {
            const field = new StringField({ maxLength: 5 });
            const result = field.deserialize('12345');

            expect(result).to.be.equal('12345');
        });

        it('shouldn\'t throw error when value\'s length is less than max length', function () {
            const field = new StringField({ maxLength: 5 });
            const result = field.deserialize('1234');

            expect(result).to.be.equal('1234');
        });

        it('shouldn\'t throw error when value\'s length is equal to min length', function () {
            const field = new StringField({ minLength: 5 });
            const result = field.deserialize('12345');

            expect(result).to.be.equal('12345');
        });

        it('shouldn\'t throw error when value\'s length is greater than min length', function () {
            const field = new StringField({ minLength: 5 });
            const result = field.deserialize('123456');

            expect(result).to.be.equal('123456');
        });
    });
});
