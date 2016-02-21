/* global describe, it */
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

        it('should throw error when default is not a number', function () {
            let func = () => new IntegerField({ default: '7' });

            expect(func).to.throw('Default value of IntegerField must be an integer');
        });

        it('should throw error when default is not an integer', function () {
            let func = () => new IntegerField({ default: 7.7 });

            expect(func).to.throw('Default value of IntegerField must be an integer');
        });

        it('should throw error when "min" is not an integer', function () {
            let func = () => new IntegerField({ min: 7.7 });

            expect(func).to.throw('Min value of IntegerField must be an integer');
        });

        it('should throw error when "max" is not an integer', function () {
            let func = () => new IntegerField({ max: true });

            expect(func).to.throw('Max value of IntegerField must be an integer');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize integer number', function () {
            let field = new IntegerField({});
            let result = field.deserialize(12345);

            expect(result).to.be.equal(12345);
        });

        it('should convert string to number', function () {
            let field = new IntegerField({});
            let result = field.deserialize('12345');

            expect(result).to.be.equal(12345);
        });

        it('should throw error when value is a non-integer number', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize(4.2);

            expect(func).to.throw('Value must be an integer');
        });

        it('should throw error when value is a NaN', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize(NaN);

            expect(func).to.throw('Value must be an integer');
        });

        it('should throw error when value is an infinity', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize(Infinity);

            expect(func).to.throw('Value must be an integer');
        });

        it('should throw error when value is a string which doesn\'t represent decimal number', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize('123af');

            expect(func).to.throw('Value must be an integer');
        });

        it('should throw error when value isn\'t a string nor a number', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize(new Buffer(''));

            expect(func).to.throw('Value must be an integer');
        });

        it('should throw error when value is undefined', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize(undefined);

            expect(func).to.throw('Value cannot be empty');
        });

        it('should use default when value is undefined and default is specified', function () {
            let field = new IntegerField({ default: 5 });
            let result = field.deserialize(undefined);

            expect(result).to.be.equal(5);
        });

        it('should return null when value is undefined and blank values are allowed', function () {
            let field = new IntegerField({ blank: true });
            let result = field.deserialize(undefined);

            expect(result).to.be.equal(null);
        });

        it('should throw error when value is null', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize(null);

            expect(func).to.throw('Value cannot be empty');
        });

        it('should use default when value is null and default is specified', function () {
            let field = new IntegerField({ default: -5 });
            let result = field.deserialize(null);

            expect(result).to.be.equal(-5);
        });

        it('should return null when value is null and blank values are allowed', function () {
            let field = new IntegerField({ blank: true });
            let result = field.deserialize(null);

            expect(result).to.be.equal(null);
        });

        it('should throw error when value is an empty string', function () {
            let field = new IntegerField({});
            let func = () => field.deserialize('');

            expect(func).to.throw('Value cannot be empty');
        });

        it('should use default when value is empty string and default is specified', function () {
            let field = new IntegerField({ default: 1234 });
            let result = field.deserialize('');

            expect(result).to.be.equal(1234);
        });

        it('should return null when value is an empty string and blank values are allowed', function () {
            let field = new IntegerField({ blank: true });
            let result = field.deserialize('');

            expect(result).to.be.equal(null);
        });

        it('should throw error when value is less than min value', function () {
            let field = new IntegerField({ min: 4 });
            let func = () => field.deserialize(2);

            expect(func).to.throw('Value cannot be less than 4');
        });

        it('should throw error when value is greater than max value', function () {
            let field = new IntegerField({ max: -4 });
            let func = () => field.deserialize(-2);

            expect(func).to.throw('Value cannot be greater than -4');
        });

        it('should not throw error when value is equal to min value', function () {
            let field = new IntegerField({ min: -5 });
            let result = field.deserialize(-5);

            expect(result).to.be.equal(-5);
        });

        it('should not throw error when value is equal to max value', function () {
            let field = new IntegerField({ max: 5 });
            let result = field.deserialize(5);

            expect(result).to.be.equal(5);
        });

        it('should not throw error when value is greater than to min value', function () {
            let field = new IntegerField({ min: -6 });
            let result = field.deserialize(6);

            expect(result).to.be.equal(6);
        });

        it('should not throw error when value is less than to max value', function () {
            let field = new IntegerField({ max: 6 });
            let result = field.deserialize(-6);

            expect(result).to.be.equal(-6);
        });
    });
});
