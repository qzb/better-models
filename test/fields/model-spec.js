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
                    throw new Field.ValidationError(this.params.msg);
                }
            }

            let field = new ModelField({
                foo: new InvalidField({ msg: 'bar' }),
                egg: new InvalidField({ msg: 'spam' })
            });

            try {
                field.deserialize({ foo: true, egg: true });
            } catch (error) {
                expect(error).to.be.instanceOf(Field.ValidationError);
                expect(error.message).to.have.property('foo', 'bar');
                expect(error.message).to.have.property('egg', 'spam');
            }
        });
    });
});

