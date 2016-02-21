/* global describe, it */
'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const EmailField = require('../../lib/fields/email');

describe('EmailField', function () {
    describe('constructor', function () {
        it('should create new instance of field', function () {
            let field = new EmailField();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(EmailField);
        });

        it('should throw error when default is not a string', function () {
            let func = () => new EmailField({ default: 7 });

            expect(func).to.throw('Default value of StringField must be a string');
        });

        it('should throw error when default is null', function () {
            let func = () => new EmailField({ default: null });

            expect(func).to.throw('Default value of StringField must be a string');
        });

        it('should throw error when default is not a valid email address', function () {
            let func = () => new EmailField({ default: 'abcdef' });

            expect(func).to.throw('Default value of EmailField must be a valid email address');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize valid email address', function () {
            let field = new EmailField({});
            let result = field.deserialize('test+siabadaba@gmail.com');

            expect(result).to.be.equal('test+siabadaba@gmail.com');
        });

        it('should trim value', function () {
            let field = new EmailField({});
            let result = field.deserialize('   test+siabadaba@gmail.com \t\r\n');

            expect(result).to.be.equal('test+siabadaba@gmail.com');
        });

        it('should throw error when value is not a valid email address', function () {
            let field = new EmailField({});
            let func = () => field.deserialize('.test+siabadaba@.gmail.com');

            expect(func).to.throw('Value must be a valid email address');
        });

        it('should throw error when value is not a string', function () {
            let field = new EmailField({});
            let func = () => field.deserialize(123);

            expect(func).to.throw('Value must be a string');
        });

        it('should throw error when value is empty', function () {
            let field = new EmailField({});
            let func = () => field.deserialize('');

            expect(func).to.throw('Value cannot be empty');
        });

        it('should use default when value is empty and default is specified', function () {
            let field = new EmailField({ default: 'test@test.com' });
            let result = field.deserialize('');

            expect(result).to.be.equal('test@test.com');
        });

        it('should return empty string when value is empty and blank values are allowed', function () {
            let field = new EmailField({ blank: true });
            let result = field.deserialize('');

            expect(result).to.be.equal('');
        });
    });
});
