'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const NumberField = require('../../lib/fields/number');

describe('NumberField', function () {
    describe('constructor', function () {
        it('should create new instance of field', function () {
            let field = new NumberField();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(NumberField);
        });

        it('should create new instance of field when all params are specified', function () {
            let field = new NumberField({
                default: 15.51,
                optional: true,
                min: 10.01,
                max: 1000.0001
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(NumberField);
        });

        it('should throw error when default value is not a number', function () {
            let call = () => new NumberField({ default: '7' });

            expect(call).to.throw(Error, 'Default value must be a number');
        });

        it('should throw error when default value is not finite', function () {
            let call = () => new NumberField({ default: Infinity });

            expect(call).to.throw(Error, 'Default value must be a number');
        });

        it('should throw error when min value is not a number', function () {
            let call = () => new NumberField({ min: null });

            expect(call).to.throw(Error, 'Min value must be a number');
        });

        it('should throw error when min value is not finite', function () {
            let call = () => new NumberField({ min: -Infinity });

            expect(call).to.throw(Error, 'Min value must be a number');
        });

        it('should throw error when max value is not a number', function () {
            let call = () => new NumberField({ max: true });

            expect(call).to.throw(Error, 'Max value must be a number');
        });

        it('should throw error when max value is not finite', function () {
            let call = () => new NumberField({ max: NaN });

            expect(call).to.throw(Error, 'Max value must be a number');
        });

        it('should throw error when min value is greater than max value', function () {
            let call = () => new NumberField({ max: -10, min: 10 });

            expect(call).to.throw(Error, 'Max value must be greater than min value');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize a number', function () {
            let field = new NumberField({});
            let result = field.deserialize(12345);

            expect(result).to.be.equal(12345);
        });

        it('should convert string to number', function () {
            let field = new NumberField({});
            let result = field.deserialize('12345.1');

            expect(result).to.be.equal(12345.1);
        });

        it('should throw error when value is a NaN', function () {
            let field = new NumberField({});
            let call = () => field.deserialize(NaN);

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is an infinity', function () {
            let field = new NumberField({});
            let call = () => field.deserialize(Infinity);

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is a string which doesn\'t represent decimal number', function () {
            let field = new NumberField({});
            let call = () => field.deserialize('123af');

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is neither a string nor a number', function () {
            let field = new NumberField({});
            let call = () => field.deserialize(new Buffer('123'));

            expect(call).to.throw(Field.ValidationError, 'Value must be a number');
        });

        it('should throw error when value is less than min value', function () {
            let field = new NumberField({ min: 4 });
            let call = () => field.deserialize(2);

            expect(call).to.throw(Field.ValidationError, 'Value cannot be less than 4');
        });

        it('should throw error when value is greater than max value', function () {
            let field = new NumberField({ max: -4 });
            let call = () => field.deserialize(-2);

            expect(call).to.throw(Field.ValidationError, 'Value cannot be greater than -4');
        });

        it('shouldn\'t throw error when value is equal to min value', function () {
            let field = new NumberField({ min: -5.5 });
            let result = field.deserialize(-5.5);

            expect(result).to.be.equal(-5.5);
        });

        it('shouldn\'t throw error when value is equal to max value', function () {
            let field = new NumberField({ max: 5.5 });
            let result = field.deserialize(5.5);

            expect(result).to.be.equal(5.5);
        });

        it('shouldn\'t throw error when value is greater than min value', function () {
            let field = new NumberField({ min: -6 });
            let result = field.deserialize(6);

            expect(result).to.be.equal(6);
        });

        it('shouldn\'t throw error when value is less than max value', function () {
            let field = new NumberField({ max: 6 });
            let result = field.deserialize(-6);

            expect(result).to.be.equal(-6);
        });
    });
});
