/* global describe, it */
'use strict';

const chai = require('chai');
const expect = require('chai').expect;
const spies = require('chai-spies');
const Field = require('../lib/fields/field');
const Model = require('../lib/model');

chai.use(spies);

describe('Model', function () {
    describe('constructor', function () {
        it('should throw error when try to create instance of Model directly', function () {
            let call = () => new Model({});

            expect(call).to.throw('You can only create instances of subclasses of Model');
        });

        it('should throw error when try to create instance of Model which was not created with extend method', function () {
            let DataModel = class extends Model {};

            let call = () => new DataModel({});

            expect(call).to.throw('Model classes must be created using Model.extend method');
        });

        it('should create instance of subclass of Model', function () {
            let DataModel = Model.extend({});
            let model = new DataModel({});

            expect(model).to.be.instanceOf(DataModel);
            expect(model).to.be.instanceOf(Model);
        });

        it('should use deserialize method to deserialize provided data', function () {
            let DataModel = Model.extend({});

            DataModel.deserialize = chai.spy(() => ({
                field1: 'foo',
                field2: 'bar'
            }));

            let data = {};
            let opts = {};
            let result = new DataModel(data, opts);

            expect(DataModel.deserialize).to.have.been.called.with.exactly(data, opts);
            expect(result).to.be.instanceOf(DataModel);
            expect(result).to.have.property('field1', 'foo');
            expect(result).to.have.property('field2', 'bar');
        });

        it('should intercept validation errors', function () {
            class CustomField extends Field {
                deserialize() {
                    throw new Field.ValidationError();
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let call = () => new DataModel({ field: true });

            expect(call).to.not.throw();
        });

        it('shouldn\'t intercept errors other than Field.ValidationError', function () {
            class CustomField extends Field {
                deserialize(value) {
                    throw new Error();
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let call = () => new DataModel({ field: true });

            expect(call).to.throw(Error);
        });
    });

    describe('extend method', function () {
        it('should create subclass of Model', function () {
            let DataModel = Model.extend({});

            expect(DataModel.prototype).to.be.instanceOf(Model);
        });

        it('should create subclass of subclass of Model', function () {
            let DataModel = Model.extend({});
            let ExtraDataModel = DataModel.extend({});

            expect(ExtraDataModel.prototype).to.be.instanceOf(Model);
            expect(ExtraDataModel.prototype).to.be.instanceOf(DataModel);
        });

        it('should create static property "fields" containing all fields of model', function () {
            let field1 = new Field();
            let field2 = new Field();

            let DataModel = Model.extend({ field1, field2 });

            expect(DataModel.fields).to.have.property('field1', field1);
            expect(DataModel.fields).to.have.property('field2', field2);
        });

        it('should add parent\'s fields to fields property', function () {
            let parentField1 = new Field();
            let parentField2 = new Field();
            let ownField2 = new Field();
            let ownField3 = new Field();

            let ParentModel = Model.extend({ field1: parentField1, field2: parentField2 });
            let DataModel = ParentModel.extend({ field2: ownField2, field3: ownField3 });

            expect(DataModel.fields).to.have.property('field1', parentField1);
            expect(DataModel.fields).to.have.property('field2', ownField2);
            expect(DataModel.fields).to.have.property('field3', ownField3);
        });

        it('should freeze fields property', function () {
            let DataModel = Model.extend({});

            expect(DataModel.fields).to.be.frozen;
        });

        it('should throw error when any of specified properties is not a Field instance', function () {
            let call = () => Model.extend({ invalid: true });

            expect(call).to.throw('All properties passed to extend method must be instances of Field class');
        });
    });

    describe('getErrors method', function () {
        it('should return validation errors', function () {
            let DataModel = Model.extend({});
            let error = new Field.ValidationError({});

            DataModel.deserialize = function () {
                throw error;
            };

            let model = new DataModel({});
            let result = model.getErrors();

            expect(result).to.be.equal(error.message);
        });

        it('should return null when there is no errors', function () {
            let DataModel = Model.extend({
                field1: new Field(),
                field2: new Field()
            });

            let model = new DataModel({ field1: 12, field2: false });
            let errors = model.getErrors();

            expect(errors).to.be.null;
        });
    });

    describe('getOptions method', function () {
        it('should return options passed to constructor', function () {
            let DataModel = Model.extend({});

            let opts = { option: 'option' };
            let model = new DataModel({}, opts);
            let result = model.getOptions();

            expect(result).to.be.deep.equal(opts);
            expect(result).to.be.not.equal(opts);
            expect(result).to.be.frozen;
        });

        it('should return empty object when no options were passed to constructor', function () {
            let DataModel = Model.extend({});

            let model = new DataModel({});
            let result = model.getOptions();

            expect(result).to.be.deep.equal({});
            expect(result).to.be.frozen;
        });
    });

    describe('getRawData method', function () {
        it('should return data passed to Model\'s constructor', function () {
            let DataModel = Model.extend({});

            let data = { foo: 'bar' };
            let model = new DataModel(data);

            expect(model.getRawData()).to.be.equal(data);
        });
    });

    describe('toJSON method', function () {
        it('should call serialize method', function () {
            let DataModel = Model.extend({});

            DataModel.serialize = chai.spy(() => 'SERIALIZED DATA');

            let opts = {};
            let model = new DataModel({}, opts);
            let result = model.toJSON();

            expect(DataModel.serialize).to.be.called.with.exactly(model, opts);
            expect(result).to.be.deep.equal('SERIALIZED DATA');
        });
    });

    describe('deserialize method', function () {
        it('should deserialize not empty fields using deserialize method', function () {
            class CustomField extends Field {
                deserialize() {
                    return 'deserialize';
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let result = DataModel.deserialize({ field: false });

            expect(result).to.have.property('field', 'deserialize');
        });

        it('should deserialize empty fields using deserializeBlank method', function () {
            class CustomField extends Field {
                deserializeBlank() {
                    return 'deserializeBlank';
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let result = DataModel.deserialize({});

            expect(result).to.have.property('field', 'deserializeBlank');
        });

        it('should use isBlank method to determine if field is empty', function () {
            let field = new Field();

            field.isBlank = (value) => !!value;
            field.deserialize = chai.spy();
            field.deserializeBlank = chai.spy();

            let DataModel = Model.extend({
                field1: field,
                field2: field
            });

            DataModel.deserialize({
                field1: null,
                field2: true
            });

            expect(field.deserialize).to.have.been.called.once.with(null);
            expect(field.deserializeBlank).to.have.been.called.once;
        });
        
        it('should aggregate all validation errors into single error', function () {
            class InvalidField extends Field {
                deserialize() {
                    throw new Field.ValidationError(this.params.msg);
                }
            }

            let DataModel = Model.extend({
                field1: new InvalidField({ msg: 'abc' }),
                field2: new InvalidField({ msg: 'def' })
            });

            try {
                DataModel.deserialize({ field1: true, field2: true });
            } catch (error) {
                expect(error).to.be.instanceOf(Field.ValidationError);
                expect(error.message).to.have.property('field1', 'abc');
                expect(error.message).to.have.property('field2', 'def');
            }
        });

        it('should ignore all non-field related properties from specified data object', function () {
            let DataModel = Model.extend({});

            let result = DataModel.deserialize({
                foo: 'bar'
            });

            expect(result).to.not.have.property('foo');
        });

        it('should pass specified options to field\'s deserialize method', function () {
            let field = new Field();

            field.deserialize = chai.spy();

            let DataModel = Model.extend({ field });
            let data = { field: 'field' };
            let opts = { option: 'option' };

            DataModel.deserialize(data, opts);

            expect(field.deserialize).to.have.been.called.with.exactly(data.field, opts);
        });

        it('should pass specified options to field\'s deserializeBlank method', function () {
            let field = new Field({ optional: true });

            field.deserializeBlank = chai.spy();

            let DataModel = Model.extend({ field });
            let opts = { option: 'option' };

            DataModel.deserialize({}, opts);

            expect(field.deserializeBlank).to.have.been.called.with.exactly(opts);
        });

        it('shouldn\'t deserialize missing properties when "partial" option is enabled', function () {
            let DataModel = Model.extend({
                field: new Field({ default: true })
            });

            let result = DataModel.deserialize({}, { partial: true });

            expect(result).to.not.have.property('field');
        });
    });

    describe('serialize method', function () {
        it('should serialize not empty fields using serialize method', function () {
            class CustomField extends Field {
                serialize(value) {
                    return 'serialize';
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let result = DataModel.serialize({ field: true });

            expect(result).to.have.property('field', 'serialize');
        });

        it('should serialize empty fields using serializeBlank method', function () {
            class CustomField extends Field {
                serializeBlank() {
                    return 'serializeBlank';
                }
            }

            let DataModel = Model.extend({
                field1: new CustomField(),
                field2: new CustomField()
            });

            let result = DataModel.serialize({});

            expect(result).to.have.property('field1', 'serializeBlank');
            expect(result).to.have.property('field2', 'serializeBlank');
        });

        it('shouldn\'t copy values of non-field properties', function () {
            let DataModel = Model.extend({});

            let result = DataModel.serialize({
                foo: 'bar'
            });

            expect(result).to.not.have.property('foo');
        });

        it('should use isBlank method to determine if field is empty', function () {
            let field = new Field();

            field.isBlank = (value) => !!value;
            field.serialize = chai.spy();
            field.serializeBlank = chai.spy();

            let DataModel = Model.extend({
                field1: field,
                field2: field
            });

            let result = DataModel.serialize({
                field1: null,
                field2: true
            });

            expect(field.serialize).to.have.been.called.once.with(null);
            expect(field.serializeBlank).to.have.been.called.once;
        });

        it('should pass options to field\'s serialize method', function () {
             let field = new Field();

            field.serialize = chai.spy();

            let DataModel = Model.extend({ field });
            let data = { field: 'field' };
            let opts = { option: 'option' };

            DataModel.serialize(data, opts);

            expect(field.serialize).to.have.been.called.with.exactly(data.field, opts);
        });

        it('should pass options to field\'s serializeBlank method', function () {
            let field = new Field();

            field.serializeBlank = chai.spy();

            let DataModel = Model.extend({ field });
            let opts = { option: 'option' };

            DataModel.serialize({}, opts);

            expect(field.serializeBlank).to.have.been.called.with.exactly(opts);
        });

        it('shouldn\'t serialize missing properties when "partial" option is enabled', function () {
            let DataModel = Model.extend({
                field: new Field({ default: true })
            });

            let result = DataModel.serialize({}, { partial: true });

            expect(result).to.not.have.property('field');
        });
    });
});
