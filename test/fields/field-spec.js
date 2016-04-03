'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');

describe('Field', function () {
    describe('constructor', function () {
        it('should create new instance', function () {
            let field = new Field();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.have.property('params');
            expect(field.params).to.be.deep.equal({});
        });

        it('should create new instance when all params are specified', function () {
            let params = {
                default: {},
                optional: true,
                foo: 'bar'
            };

            let field = new Field(params);

            expect(field).to.be.instanceOf(Field);
            expect(field.params).to.be.deep.equal(params);
            expect(field.params).to.be.deep.frozen;
        });
    });

    describe('serialize method', function () {
        it('should return passed value', function () {
            let field = new Field();

            let value = {};
            let result = field.serialize(value);

            expect(result).to.be.equal(value);
        });
    });

    describe('deserialize method', function () {
        it('should return passed value', function () {
            let field = new Field();

            let value = {};
            let result = field.deserialize(value);

            expect(result).to.be.equal(value);
        });
    });

    describe('serializeBlank method', function () {
        it('should return passed value', function () {
            let field = new Field();

            let result = field.serializeBlank();

            expect(result).to.be.null;
        });
    });

    describe('deserializeBlank method', function () {
        it('should return null when field is optional', function () {
            let field = new Field({ optional: true });

            let result = field.deserializeBlank();

            expect(result).to.be.null;
        });

        it('should return default value when it is specified and field is not optional', function () {
            let field = new Field({ default: 'lime in the coconut' });

            let result = field.deserializeBlank();

            expect(result).to.be.equal('lime in the coconut');
        });

        it('should return default value when it is specified and field is optional', function() {
            let field = new Field({ default: 'lime in the coconut', optional: true });

            let result = field.deserializeBlank();

            expect(result).to.be.equal('lime in the coconut');
        });

        it('should throw error when field is not optional and there is no default value', function () {
            let field = new Field();

            let call = () => field.deserializeBlank();

            expect(call).to.throw('Value cannot be empty');
        });
    });

    describe('isBlank', function () {
        it('should return true when value is null', function () {
            let field = new Field();
            let result = field.isBlank(null);

            expect(result).to.be.true;
        });

        it('should return true when value is undefined', function () {
            let field = new Field();
            let result = field.isBlank(undefined);

            expect(result).to.be.true;
        });

        it('should return true when value is empty string', function () {
            let field = new Field();
            let result = field.isBlank('');

            expect(result).to.be.true;
        });

        it('should return false when value is empty array', function () {
            let field = new Field();
            let result = field.isBlank([]);

            expect(result).to.be.false;
        });

        it('should return false when value is empty object', function () {
            let field = new Field();
            let result = field.isBlank({});

            expect(result).to.be.false;
        });

        it('should return false when value is false', function () {
            let field = new Field();
            let result = field.isBlank(false);

            expect(result).to.be.false;
        });
    });
});
