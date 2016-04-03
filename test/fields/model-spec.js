'use strict';

const expect = require('chai').expect;
const Model = require('../../lib/model');
const Field = require('../../lib/fields/field');
const ModelField = require('../../lib/fields/model');

describe('ModelField', function() {
    describe('constructor', function() {
        it('should create new instance of field using specified model', function() {
            let CustomModel = Model.extend({});
            let field = new ModelField(CustomModel);

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(ModelField);
            expect(field).to.have.property('Model', CustomModel);
        });

        it('should create new instance of field using specified object to create a new model', function () {
            let field = new ModelField({ test: 123 });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(ModelField);
            expect(field).to.have.deep.property('Model.prototype.test', 123);
        });

        it('should create new instance of field when all params are specified', function () {
            let field = new ModelField({}, {
                optional: true
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(ModelField);
        });

        it('should throw error when model is not specified', function() {
            let call = () => new ModelField();

            expect(call).to.throw(Error, 'Model is missing');
        });

        it('should throw error when default value is specified', function() {
            let call = () => new ModelField({}, { default: {} });

            expect(call).to.throw(Error, 'This field doesn\'t accept default value');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize value', function() {
            let field = new ModelField({ foo: new Field() });
            let result = field.deserialize({ foo: 123, bar: 456 });

            expect(result).to.be.eql({ foo: 123 });
        });

        it('should throw error when value is not an object', function() {
            let field = new ModelField({ foo: new Field() });
            let call = () => field.deserialize(123);

            expect(call).to.throw(Field.ValidationError, 'Value must be an object');
        });

        it('should throw error when value isn\'t valid according to field\'s model', function() {
            class InvalidField extends Field {
                deserialize() {
                    throw new Field.ValidationError('oops!');
                }
            }

            let field = new ModelField({ foo: new InvalidField(), bar: new InvalidField() });
            let call = () => field.deserialize({ foo: 514 });

            expect(call).to.throw(Field.ValidationError, 'foo: oops!');
        });
    });
});

