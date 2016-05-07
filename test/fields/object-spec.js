'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const ObjectField = require('../../lib/fields/object');

describe('ObjectField', function() {
    describe('constructor', function() {
        it('should create new instance of field using specified field', function() {
            let field = new Field();
            let objectField = new ObjectField(field);

            expect(objectField).to.be.instanceOf(Field);
            expect(objectField).to.be.instanceOf(ObjectField);
            expect(objectField).to.have.property('field', field);
        });

        it('should create new instance of field when all params are specified', function () {
            let field = new ObjectField(new Field(), {
                blank: true,
                default: { foo: 'bar' }
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(ObjectField);
        });

        it('should throw error when field is not specified', function() {
            let call = () => new ObjectField();

            expect(call).to.throw('Field is missing');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize value', function() {
            class CustomField extends Field {
                deserialize() { return true }
            }

            let field = new ObjectField(new CustomField());

            let result = field.deserialize({ foo: 1, bar: 2 });

            expect(result).to.be.deep.equal({ foo: true, bar: true });
        });

        it('should deserialize empty object', function () {
            let field = new ObjectField(new Field());

            let result = field.deserialize({});

            expect(result).to.be.deep.equal({});
        });

        it('should throw error when value is not an object', function() {
            let field = new ObjectField(new Field());

            let call = () => field.deserialize(123);

            expect(call).to.throw(Field.ValidationError, 'Value must be an object');
        });

        it('should throw error when any of objects\'s fields are not valid according to specified field', function() {
            class InvalidField extends Field {
                deserialize(v) { throw new Field.ValidationError(v) }
            }

            let field = new ObjectField(new InvalidField());

            try {
                field.deserialize({ foo: 1, bar: 2 });
            } catch (error) {
                expect(error).to.be.instanceOf(Field.ValidationError);
                expect(error.message).to.have.property('foo', 1);
                expect(error.message).to.have.property('bar', 2);
            }
        });

        it('should not intercept errors other than ValidationError', function () {
            let error = new Error();

            class InvalidField extends Field {
                deserialize(v) { throw error }
            }

            let field = new ObjectField(new InvalidField());

            let call = () => field.deserialize({ foo: 'bar' });

            expect(call).to.throw(error);
        });
    });

    describe('serialize method', function () {
        it('should serialize value', function () {
            class CustomField extends Field {
                serialize() { return true }
            }

            let field = new ObjectField(new CustomField());

            let result = field.serialize({ foo: false, bar: false });

            expect(result).to.be.deep.equal({ foo: true, bar: true });
        });

        it('should deserialize empty object', function () {
            let field = new ObjectField(new Field());

            let result = field.serialize({});

            expect(result).to.be.deep.equal({});
        });
    });
});
