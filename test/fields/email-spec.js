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

        it('should create new instance of field when all params are specified', function () {
            let field = new EmailField({
                default: 'test@dev.null',
                blank: true,
                caseSensitive: true
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(EmailField);
        });

        it('should throw error when default value is not a string', function () {
            let call = () => new EmailField({ default: 7 });

            expect(call).to.throw('Default value must be a string');
        });

        it('should throw error when default value is not a valid email address', function () {
            let call = () => new EmailField({ default: 'abcdef' });

            expect(call).to.throw('Default value must be a valid email address');
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

        it('should lowercase value', function () {
            let field = new EmailField({});
            let result = field.deserialize('TeSt@sIaBaDaBa.cOm');

            expect(result).to.be.equal('test@siabadaba.com');
        });

        it('shouldn\'t lowercase value when caseSensitive option is enabled', function () {
            let field = new EmailField({ caseSensitive: true });
            let result = field.deserialize('TeSt@sIaBaDaBa.cOm');

            expect(result).to.be.equal('TeSt@sIaBaDaBa.cOm');
        });

        it('should throw error when value isn\'t a valid email address', function () {
            let field = new EmailField({});
            let call = () => field.deserialize('.test+siabadaba@.gmail.com');

            expect(call).to.throw('Value must be a valid email address');
        });

        it('should throw error when value isn\'t a string', function () {
            let field = new EmailField({});
            let call = () => field.deserialize(123);

            expect(call).to.throw('Value must be a string');
        });

        it('should throw error when value is empty', function () {
            let field = new EmailField({});

            expect(() => {
                field.deserialize('');
            }).to.throw('Value cannot be empty');

            expect(() => {
                field.deserialize(null);
            }).to.throw('Value cannot be empty');

            expect(() => {
                field.deserialize(undefined);
            }).to.throw('Value cannot be empty');
        });

        it('should use default when value is empty and default is specified', function () {
            let field = new EmailField({ default: 'test@test.com' });

            expect(field.deserialize('')).to.be.equal('test@test.com');
            expect(field.deserialize(null)).to.be.equal('test@test.com');
            expect(field.deserialize(undefined)).to.be.equal('test@test.com');
        });

        it('should return empty string when value is empty and blank values are allowed', function () {
            let field = new EmailField({ blank: true });

            expect(field.deserialize('')).to.be.equal('');
            expect(field.deserialize(null)).to.be.equal('');
            expect(field.deserialize(undefined)).to.be.equal('');
        });
    });
});
