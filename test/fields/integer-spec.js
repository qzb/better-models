'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const IntegerField = require('../../lib/fields/integer');

describe('IntegerField', function () {
    describe('constructor', function () {
        it('should create new instance of field', function () {
            let field = new IntegerField();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(IntegerField);
        });

        it('should create new instance of field when all params are specified', function () {
            let field = new IntegerField({
                default: 15,
                blank: true,
                min: 10,
                max: 1000
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(IntegerField);
        });

        it('should throw error when default value is not a number', function () {
            let call = () => new IntegerField({ default: '7' });

            expect(call).to.throw('Default value must be a number');
        });

        it('should throw error when default value is not finite', function () {
            let call = () => new IntegerField({ default: Infinity });

            expect(call).to.throw('Default value must be a number');
        });

        it('should throw error when default value is not an integer', function () {
            let call = () => new IntegerField({ default: 7.7 });

            expect(call).to.throw('Default value must be an integer');
        });

        it('should throw error when min value is not a number', function () {
            let call = () => new IntegerField({ min: null });

            expect(call).to.throw('Min value must be a number');
        });

        it('should throw error when min value is not finite', function () {
            let call = () => new IntegerField({ min: -Infinity });

            expect(call).to.throw('Min value must be a number');
        });

        it('should throw error when min value is not an integer', function () {
            let call = () => new IntegerField({ min: 12.3 });

            expect(call).to.throw('Min value must be an integer');
        });

        it('should throw error when max value is not a number', function () {
            let call = () => new IntegerField({ max: true });

            expect(call).to.throw('Max value must be a number');
        });

        it('should throw error when max value is not finite', function () {
            let call = () => new IntegerField({ max: NaN });

            expect(call).to.throw('Max value must be a number');
        });

        it('should throw error when max value is not an integer', function () {
            let call = () => new IntegerField({ max: 0.1 });

            expect(call).to.throw('Max value must be an integer');
        });

        it('should throw error when min value is greater than max value', function () {
            let call = () => new IntegerField({ max: -10, min: 10 });

            expect(call).to.throw('Max value must be greater than min value');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize an integer', function () {
            let field = new IntegerField({});
            let result = field.deserialize(0);

            expect(result).to.be.equal(0);
        });

        it('should convert string to number', function () {
            let field = new IntegerField({});
            let result = field.deserialize('12345');

            expect(result).to.be.equal(12345);
        });

        it('should throw error when value is a number but isn\'t an integer', function () {
            let field = new IntegerField({});
            let call = () => field.deserialize(12345.6);

            expect(call).to.throw('Value must be an integer');
        });

        it('should throw error when value is a NaN', function () {
            let field = new IntegerField({});
            let call = () => field.deserialize(NaN);

            expect(call).to.throw('Value must be a number');
        });

        it('should throw error when value is an infinity', function () {
            let field = new IntegerField({});
            let call = () => field.deserialize(Infinity);

            expect(call).to.throw('Value must be a number');
        });

        it('should throw error when value is a string which doesn\'t represent integer', function () {
            let field = new IntegerField({});
            let call = () => field.deserialize('123af');

            expect(call).to.throw('Value must be a number');
        });

        it('should throw error when value is neither a string nor a number', function () {
            let field = new IntegerField({});
            let call = () => field.deserialize(new Buffer('123'));

            expect(call).to.throw('Value must be a number');
        });

        it('should throw error when value is less than min value', function () {
            let field = new IntegerField({ min: 4 });
            let call = () => field.deserialize(2);

            expect(call).to.throw('Value cannot be less than 4');
        });

        it('should throw error when value is greater than max value', function () {
            let field = new IntegerField({ max: -4 });
            let call = () => field.deserialize(-2);

            expect(call).to.throw('Value cannot be greater than -4');
        });

        it('shouldn\'t throw error when value is equal to min value', function () {
            let field = new IntegerField({ min: -5 });
            let result = field.deserialize(-5);

            expect(result).to.be.equal(-5);
        });

        it('shouldn\'t throw error when value is equal to max value', function () {
            let field = new IntegerField({ max: 5 });
            let result = field.deserialize(5);

            expect(result).to.be.equal(5);
        });

        it('shouldn\'t throw error when value is greater than min value', function () {
            let field = new IntegerField({ min: -6 });
            let result = field.deserialize(6);

            expect(result).to.be.equal(6);
        });

        it('shouldn\'t throw error when value is less than max value', function () {
            let field = new IntegerField({ max: 6 });
            let result = field.deserialize(-6);

            expect(result).to.be.equal(-6);
        });
    });
});
