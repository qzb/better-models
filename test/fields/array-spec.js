'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const ArrayField = require('../../lib/fields/array');

describe('ArrayField', function() {
    describe('constructor', function() {
        it('should create new instance of field using specified field', function() {
            let field = new Field();
            let arrayField = new ArrayField(field);

            expect(arrayField).to.be.instanceOf(Field);
            expect(arrayField).to.be.instanceOf(ArrayField);
            expect(arrayField).to.have.property('field', field);
        });

        it('should create new instance of field when all params are specified', function () {
            let field = new ArrayField(new Field(), {
                blank: true,
                default: [ 1, 2 ],
                minLength: 1,
                maxLength: 2
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(ArrayField);
        });

        it('should throw error when field is not specified', function() {
            let call = () => new ArrayField();

            expect(call).to.throw('Field is missing');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize value', function() {
            class CustomField extends Field {
                deserialize() { return true }
            }

            let field = new ArrayField(new CustomField());

            let result = field.deserialize([ 1, 2 ]);

            expect(result).to.be.deep.equal([ true, true ]);
        });

        it('should deserialize empty array', function () {
            let field = new ArrayField(new Field());

            let result = field.deserialize([]);

            expect(result).to.be.deep.equal([]);
        });

        it('should throw error when value is not an array', function() {
            let field = new ArrayField(new Field());

            let call = () => field.deserialize(123);

            expect(call).to.throw(Field.ValidationError, 'Value must be an array');
        });

        it('should throw error when any of array\'s values are not valid according to specified field', function() {
            class InvalidField extends Field {
                deserialize(v) { throw new Field.ValidationError(v) }
            }

            let field = new ArrayField(new InvalidField());

            try {
                field.deserialize([ 1, 2 ]);
            } catch (error) {
                expect(error).to.be.instanceOf(Field.ValidationError);
                expect(error.message).to.have.property('0', 1);
                expect(error.message).to.have.property('1', 2);
            }
        });

        it('should not intercept errors other than ValidationError', function () {
            let error = new Error();

            class InvalidField extends Field {
                deserialize(v) { throw error }
            }

            let field = new ArrayField(new InvalidField());

            let call = () => field.deserialize([ 1 ]);

            expect(call).to.throw(error);
        });

        it('should throw error array\'s length is less than min length', function() {
            let field = new ArrayField(new Field(), { minLength: 2 });

            let call = () => field.deserialize([ 1 ]);

            expect(call).to.throw(Field.ValidationError, 'Value must have at least 2 elements');
        });

        it('should throw when array\'s length is greater than than max length', function() {
            let field = new ArrayField(new Field(), { maxLength: 2 });

            let call = () => field.deserialize([ 1, 2, 3 ]);

            expect(call).to.throw(Field.ValidationError, 'Value must have at most 2 elements');
        });

        it('should not throw when array\'s length is less than or equal to max length', function() {
            let field = new ArrayField(new Field(), { maxLength: 2 });

            let call1 = () => field.deserialize([ 1, 2 ]);
            let call2 = () => field.deserialize([ 1 ]);

            expect(call1).to.not.throw();
            expect(call2).to.not.throw();
        });

        it('should not throw when array\'s length is greater than or equal to min length', function() {
            let field = new ArrayField(new Field(), { minLength: 2 });

            let call1 = () => field.deserialize([ 1, 2, 3 ]);
            let call2 = () => field.deserialize([ 1, 2 ]);

            expect(call1).to.not.throw();
            expect(call2).to.not.throw();
        });
    });

    describe('serialize method', function () {
        it('should serialize value', function () {
            class CustomField extends Field {
                serialize() { return true }
            }

            let field = new ArrayField(new CustomField());

            let result = field.serialize([ 1, 2 ]);

            expect(result).to.be.deep.equal([ true, true ]);
        });

        it('should deserialize empty array', function () {
            let field = new ArrayField(new Field());

            let result = field.serialize([]);

            expect(result).to.be.deep.equal([]);
        });
    });
});

