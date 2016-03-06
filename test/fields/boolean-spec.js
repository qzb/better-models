'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const BooleanField = require('../../lib/fields/boolean');

describe('BooleanField', function () {
    describe('constructor', function () {
        it('should create new instance', function () {
            let field = new BooleanField();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(BooleanField);
        });

        it('should create new instance when all params are specified', function () {
            let field = new BooleanField({
                default: false,
                blank: true
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(BooleanField);
        });

        it('should throw error when default value is not a boolean', function () {
            let call = () => new BooleanField({ default: 'true' });

            expect(call).to.throw('Default value must be a boolean');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize boolean "true" to true', function () {
            let field = new BooleanField({});
            let result = field.deserialize(true);

            expect(result).to.be.equal(true);
        });

        it('should deserialize boolean "false" to false', function () {
            let field = new BooleanField({});
            let result = field.deserialize(false);

            expect(result).to.be.equal(false);
        });

        it('should deserialize strings representing any YAML boolean literals', function () {
            let field = new BooleanField({});

            expect(field.deserialize('y')).to.be.equal(true);
            expect(field.deserialize('yes')).to.be.equal(true);
            expect(field.deserialize('on')).to.be.equal(true);
            expect(field.deserialize('true')).to.be.equal(true);
            expect(field.deserialize('Y')).to.be.equal(true);
            expect(field.deserialize('YES')).to.be.equal(true);
            expect(field.deserialize('ON')).to.be.equal(true);
            expect(field.deserialize('TRUE')).to.be.equal(true);
            expect(field.deserialize('Yes')).to.be.equal(true);
            expect(field.deserialize('On')).to.be.equal(true);
            expect(field.deserialize('True')).to.be.equal(true);

            expect(field.deserialize('n')).to.be.equal(false);
            expect(field.deserialize('no')).to.be.equal(false);
            expect(field.deserialize('off')).to.be.equal(false);
            expect(field.deserialize('false')).to.be.equal(false);
            expect(field.deserialize('N')).to.be.equal(false);
            expect(field.deserialize('NO')).to.be.equal(false);
            expect(field.deserialize('OFF')).to.be.equal(false);
            expect(field.deserialize('FALSE')).to.be.equal(false);
            expect(field.deserialize('No')).to.be.equal(false);
            expect(field.deserialize('Off')).to.be.equal(false);
            expect(field.deserialize('False')).to.be.equal(false);
        });

        it('should throw error when value is a string but doesn\'t match to any YAML literals', function () {
            let field = new BooleanField({});
            let call = () => console.log(field.deserialize('nope'));

            expect(call).to.throw('Value must be a boolean');
        });

        it('should throw error when value is neither boolean nor string', function () {
            let field = new BooleanField({});
            let call = () => field.deserialize(0);

            expect(call).to.throw('Value must be a boolean');
        });

        it('should throw error when value is empty', function () {
            let field = new BooleanField({});

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

        it('should use default when value is empty and default value is specified', function () {
            let field = new BooleanField({ default: true });

            expect(field.deserialize('')).to.be.equal(true);
            expect(field.deserialize(null)).to.be.equal(true);
            expect(field.deserialize(undefined)).to.be.equal(true);
        });

        it('should return null when value is empty and blank values are enabled', function () {
            let field = new BooleanField({ blank: true });

            expect(field.deserialize('')).to.be.equal(null);
            expect(field.deserialize(null)).to.be.equal(null);
            expect(field.deserialize(undefined)).to.be.equal(null);
        });
    });
});