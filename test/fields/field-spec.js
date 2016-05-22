'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');

describe('Field', function () {
    describe('constructor', function () {
        it('should create new instance', function () {
            const field = new Field();

            expect(field).to.be.instanceOf(Field);
            expect(field).to.have.property('params');
            expect(field.params).to.be.deep.equal({});
        });

        it('should pass all specified arguments to init method', function () {
            class TestField extends Field {
                init() {
                    this.args = Array.prototype.slice.call(arguments);
                    super.init.apply(this, arguments);
                }
            }

            const field = new TestField(1, 2, 3);

            expect(field.args).to.be.deep.equal([1, 2, 3]);
        });

        it('should freeze params', function () {
            const field = new Field();

            expect(field.params).to.be.frozen;
        });

        it('should throw error when default value is invalid', function () {
            class TestField extends Field {
                deserialize() {
                    throw new Field.ValidationError('Value is invalid');
                }
            }

            const call = () => new TestField({ default: true });

            expect(call).to.throw(Error, 'Default value is invalid: value is invalid');
        });

        it('should throw error when unexpected error occurs during deserialization of default value', function () {
            const error = new Error();
            class TestField extends Field {
                deserialize() {
                    throw error;
                }
            }

            const call = () => new TestField({ default: true });

            expect(call).to.throw(error);
        });
    });

    describe('init method', function () {
        it('should copy params to field', function () {
            const params = {
                default: {},
                optional: true,
                foo: 'bar'
            };

            const field = {};
            Field.prototype.init.call(field, params);

            expect(field.params).to.be.deep.equal(params);
            expect(field.params).to.be.not.equal(params);
            expect(field.params).to.be.not.frozen;
        });
    });

    describe('serialize method', function () {
        it('should return passed value', function () {
            const field = new Field();

            const value = {};
            const result = field.serialize(value);

            expect(result).to.be.equal(value);
        });
    });

    describe('deserialize method', function () {
        it('should return passed value', function () {
            const field = new Field();

            const value = {};
            const result = field.deserialize(value);

            expect(result).to.be.equal(value);
        });
    });

    describe('serializeBlank method', function () {
        it('should return passed value', function () {
            const field = new Field();

            const result = field.serializeBlank();

            expect(result).to.be.null;
        });
    });

    describe('deserializeBlank method', function () {
        it('should return null when field is optional', function () {
            const field = new Field({ optional: true });

            const result = field.deserializeBlank();

            expect(result).to.be.null;
        });

        it('should return default value when it is specified and field is not optional', function () {
            const field = new Field({ default: 'lime in the coconut' });

            const result = field.deserializeBlank();

            expect(result).to.be.equal('lime in the coconut');
        });

        it('should return default value when it is specified and field is optional', function() {
            const field = new Field({ default: 'lime in the coconut', optional: true });

            const result = field.deserializeBlank();

            expect(result).to.be.equal('lime in the coconut');
        });

        it('should throw error when field is not optional and there is no default value', function () {
            const field = new Field();

            const call = () => field.deserializeBlank();

            expect(call).to.throw(Field.ValidationError, 'Value cannot be empty');
        });
    });

    describe('isBlank', function () {
        it('should return true when value is null', function () {
            const field = new Field();
            const result = field.isBlank(null);

            expect(result).to.be.true;
        });

        it('should return true when value is undefined', function () {
            const field = new Field();
            const result = field.isBlank(undefined);

            expect(result).to.be.true;
        });

        it('should return true when value is empty string', function () {
            const field = new Field();
            const result = field.isBlank('');

            expect(result).to.be.true;
        });

        it('should return false when value is empty array', function () {
            const field = new Field();
            const result = field.isBlank([]);

            expect(result).to.be.false;
        });

        it('should return false when value is empty object', function () {
            const field = new Field();
            const result = field.isBlank({});

            expect(result).to.be.false;
        });

        it('should return false when value is false', function () {
            const field = new Field();
            const result = field.isBlank(false);

            expect(result).to.be.false;
        });
    });
});
