'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const IntegerField = require('../../lib/fields/integer');

describe('IntegerField', function () {
    describe('constructor', function () {
        it('should create new instance of field', function () {
            const field = new IntegerField();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(IntegerField);
        });

        it('should create new instance of field when all params are specified', function () {
            const field = new IntegerField({
                default: 15,
                optional: true,
                min: 10,
                max: 1000
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(IntegerField);
        });

        it('should throw error when min value is not a number', function () {
            const call = () => new IntegerField({ min: null });

            expect(call).to.throw(Error, 'Min value must be a number');
        });

        it('should throw error when min value is not finite', function () {
            const call = () => new IntegerField({ min: -Infinity });

            expect(call).to.throw(Error, 'Min value must be a number');
        });

        it('should throw error when min value is not an integer', function () {
            const call = () => new IntegerField({ min: 12.3 });

            expect(call).to.throw(Error, 'Min value must be an integer');
        });

        it('should throw error when max value is not a number', function () {
            const call = () => new IntegerField({ max: true });

            expect(call).to.throw(Error, 'Max value must be a number');
        });

        it('should throw error when max value is not finite', function () {
            const call = () => new IntegerField({ max: NaN });

            expect(call).to.throw(Error, 'Max value must be a number');
        });

        it('should throw error when max value is not an integer', function () {
            const call = () => new IntegerField({ max: 0.1 });

            expect(call).to.throw(Error, 'Max value must be an integer');
        });

        it('should throw error when min value is greater than max value', function () {
            const call = () => new IntegerField({ max: -10, min: 10 });

            expect(call).to.throw(Error, 'Max value must be greater than min value');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize an integer', function () {
            const field = new IntegerField({});
            const result = field.deserialize(0);

            expect(result).to.be.equal(0);
        });

        it('should convert string to number', function () {
            const field = new IntegerField({});
            const result = field.deserialize('12345');

            expect(result).to.be.equal(12345);
        });

        it('should throw error when value is a number but isn\'t an integer', function () {
            const field = new IntegerField({});
            const call = () => field.deserialize(12345.6);

            expect(call).to.throw(Field.ValidationError, 'Value must be an integer');
        });

        it('should throw error when value is a NaN', function () {
            const field = new IntegerField({});
            const call = () => field.deserialize(NaN);

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is an infinity', function () {
            const field = new IntegerField({});
            const call = () => field.deserialize(Infinity);

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is a string which doesn\'t represent integer', function () {
            const field = new IntegerField({});
            const call = () => field.deserialize('123af');

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is neither a string nor a number', function () {
            const field = new IntegerField({});
            const call = () => field.deserialize(new Buffer('123'));

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is less than min value', function () {
            const field = new IntegerField({ min: 4 });
            const call = () => field.deserialize(2);

            expect(call).to.throw(Field.ValidationError, 'Value cannot be less than 4');
        });

        it('should throw error when value is greater than max value', function () {
            const field = new IntegerField({ max: -4 });
            const call = () => field.deserialize(-2);

            expect(call).to.throw(Field.ValidationError, 'Value cannot be greater than -4');
        });

        it('shouldn\'t throw error when value is equal to min value', function () {
            const field = new IntegerField({ min: -5 });
            const result = field.deserialize(-5);

            expect(result).to.be.equal(-5);
        });

        it('shouldn\'t throw error when value is equal to max value', function () {
            const field = new IntegerField({ max: 5 });
            const result = field.deserialize(5);

            expect(result).to.be.equal(5);
        });

        it('shouldn\'t throw error when value is greater than min value', function () {
            const field = new IntegerField({ min: -6 });
            const result = field.deserialize(6);

            expect(result).to.be.equal(6);
        });

        it('shouldn\'t throw error when value is less than max value', function () {
            const field = new IntegerField({ max: 6 });
            const result = field.deserialize(-6);

            expect(result).to.be.equal(-6);
        });
    });
});
