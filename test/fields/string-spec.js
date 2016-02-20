/* global describe, it */
'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const StringField = require('../../lib/fields/string');

describe('StringField', function () {
    describe('constructor', function () {
        it('should create new instance of field', function () {
            let field = new StringField();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(StringField);
        });

        it('should throw error when default is not a string', function () {
            let func = () => new StringField({ default: 7 });

            expect(func).to.throw('Default value of StringField must be a string');
        });

        it('should throw error when default is null', function () {
            let func = () => new StringField({ default: null });

            expect(func).to.throw('Default value of StringField must be a string');
        });

        it('should throw error when minLength is not an integer', function () {
            let func = () => new StringField({ minLength: 7.000001 });

            expect(func).to.throw('Min length of StringField must be a positive integer');
        });

        it('should throw error when minLength is negative', function () {
            let func = () => new StringField({ minLength: -1 });

            expect(func).to.throw('Min length of StringField must be a positive integer');
        });

        it('should throw error when maxLength is not an integer', function () {
            let func = () => new StringField({ maxLength: 5.55555 });

            expect(func).to.throw('Max length of StringField must be a positive integer');
        });

        it('should throw error when maxLength is negative', function () {
            let func = () => new StringField({ maxLength: -1 });

            expect(func).to.throw('Max length of StringField must be a positive integer');
        });
    });

    describe('deserialize method', function () {
        it('should use default when default value is specified and value is empty', function () {
            let field = new StringField({ default: 'abc' });
            let result = field.deserialize('');

            expect(result).to.be.equal('abc');
        });

        it('should use default when default value is specified and value is null', function () {
            let field = new StringField({ default: 'abc' });
            let result = field.deserialize(null);

            expect(result).to.be.equal('abc');
        });

        it('should use default when default value is specified and value is undefined', function () {
            let field = new StringField({ default: 'abc' });
            let result = field.deserialize(undefined);

            expect(result).to.be.equal('abc');
        });

        it('should not use default when default value is specified and value is non-empty string', function () {
            let field = new StringField({ default: 'abc' });
            let result = field.deserialize('undefined');

            expect(result).to.be.equal('undefined');
        });

        it('should throw error when value is empty', function () {
            let field = new StringField({});
            let func = () => field.deserialize('');

            expect(func).to.throw('Value cannot be empty');
        });

        it('should throw error when value is null', function () {
            let field = new StringField({});
            let func = () => field.deserialize(null);

            expect(func).to.throw('Value cannot be empty');
        });

        it('should not throw error when blank values are allowed and value is empty', function () {
            let field = new StringField({ blank: true });
            let result = field.deserialize('');

            expect(result).to.be.equal('');
        });

        it('should not throw error when blank values are allowed and value is null', function () {
            let field = new StringField({ blank: true });
            let result = field.deserialize(null);

            expect(result).to.be.equal('');
        });

        it('should throw error when value is a boolean', function () {
            let field = new StringField({});
            let func = () => field.deserialize(false);

            expect(func).to.throw('Value must be a string');
        });

        it('should throw error when value is a number', function () {
            let field = new StringField({});
            let func = () => field.deserialize(123);

            expect(func).to.throw('Value must be a string');
        });

        it('should throw error when value\'s length is greater than maxLength', function () {
            let field = new StringField({ maxLength: 5 });
            let func = () => field.deserialize('123456');

            expect(func).to.throw('Value\'s length cannot be greater than 5');
        });

        it('should throw error when value\'s length is less than minLength', function () {
            let field = new StringField({ minLength: 5 });
            let func = () => field.deserialize('1234');

            expect(func).to.throw('Value\'s length cannot be less than 5');
        });

        it('should not throw error when value\'s length is equal to maxLength', function () {
            let field = new StringField({ maxLength: 5 });
            let result = field.deserialize('12345');

            expect(result).to.be.equal('12345');
        });

        it('should not throw error when value\'s length is less than maxLength', function () {
            let field = new StringField({ maxLength: 5 });
            let result = field.deserialize('1234');

            expect(result).to.be.equal('1234');
        });

        it('should not throw error when value\'s length is equal to minLength', function () {
            let field = new StringField({ minLength: 5 });
            let result = field.deserialize('12345');

            expect(result).to.be.equal('12345');
        });

        it('should not throw error when value\'s length is greater than minLength', function () {
            let field = new StringField({ minLength: 5 });
            let result = field.deserialize('123456');

            expect(result).to.be.equal('123456');
        });

        it('should tirm value when trim option is enabled', function () {
            let field = new StringField({ trim: true });
            let result = field.deserialize('  123456   ');

            expect(result).to.be.equal('123456');
        });

        it('should not tirm value when trim option is disabled', function () {
            let field = new StringField({});
            let result = field.deserialize('  123456   ');

            expect(result).to.be.equal('  123456   ');
        });

        it('should throw error when trim option is enabled and value contains only white characters', function () {
            let field = new StringField({ trim: true });
            let func = () => field.deserialize(' \t\n\r');

            expect(func).to.throw('Value cannot be empty');
        });
    });
});
