/* global describe, it */
'use strict';

const expect = require('chai').expect;
const Field = require('../lib/fields/field');
const Model = require('../lib/model');

describe('Model', function () {
    describe('constructor', function () {
        it('should throw error when try to create instance of Model directly', function () {
            let call = () => new Model({});

            expect(call).to.throw('You can only create instances of subclasses of Model');
        });

        it('should create instance of subclass of Model', function () {
            let DataModel = Model.extend({});
            let model = new DataModel({});

            expect(model).to.be.instanceOf(DataModel);
            expect(model).to.be.instanceOf(Model);
        });

        it('should deserialize not empty fields using deserialize method', function () {
            class CustomField extends Field {
                deserialize() {
                    return 'deserialize';
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let model = new DataModel({ field: false });

            expect(model).to.have.property('field', 'deserialize');
        });

        it('should deserialize empty fields using deserializeBlank method', function () {
            class CustomField extends Field {
                isBlank(value) {
                    return true;
                }

                deserializeBlank() {
                    return 'deserializeBlank';
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let model = new DataModel({});

            expect(model).to.have.property('field', 'deserializeBlank');
        });

        it('should ignore all non-field related properties from specified data object', function () {
            let DataModel = Model.extend({});

            let model = new DataModel({ field1: 1, field2: 2 });

            expect(model).to.not.have.property('field1');
            expect(model).to.not.have.property('field2');
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
        })
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
        it('should get all errors', function () {
            class InvalidField extends Field {
                deserialize(value) {
                    throw new Field.ValidationError(value);
                }
            }

            let DataModel = Model.extend({
                field1: new InvalidField(),
                field2: new InvalidField()
            });

            let model = new DataModel({ field1: 'abc', field2: 'def', field3: 12 });
            let errors = model.getErrors();

            expect(errors).to.have.property('field1', 'abc');
            expect(errors).to.have.property('field2', 'def');
            expect(errors).to.not.have.property('field3');
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

    describe('serialize', function () {
        it('should serialize not empty fields using serialize method', function () {
            class CustomField extends Field {
                isBlank(value) {
                    return false;
                }

                serialize(value) {
                    return 'serialize';
                }
            }

            let DataModel = Model.extend({
                field: new CustomField()
            });

            let model = new DataModel({});
            let result = model.serialize();

            expect(result).to.have.property('field', 'serialize');
        });

        it('should serialize empty fields using serializeBlank method', function () {
            class CustomField extends Field {
                isBlank(value) {
                    return true;
                }

                serializeBlank() {
                    return 'serializeBlank';
                }
            }

            let DataModel = Model.extend({
                field1: new CustomField(),
                field2: new CustomField()
            });

            let model = new DataModel({ field1: true, field2: true });
            model.field1 = null;
            model.field2 = undefined;

            let result = model.serialize();

            expect(result).to.have.property('field1', 'serializeBlank');
            expect(result).to.have.property('field2', 'serializeBlank');
        });

        it('shouldn\'t copy values of non-field properties', function () {
            let DataModel = Model.extend({});
            let model = new DataModel({});

            model.field1 = 'one';
            model.constructor.prototype.field2 = 'two';

            let result = model.serialize();

            expect(result).to.not.have.property('field1');
            expect(result).to.not.have.property('field2');
        });
    });

    describe('toJSON method', function () {
        it('should be alias for serialize method', function () {
            let DataModel = Model.extend({});
            let model = new DataModel({});

            model.serialize = function () {
                return Array.from(arguments);
            };

            let result = model.toJSON(1, 2, 3);

            expect(result).to.be.deep.equal([ 1, 2, 3 ]);
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
});
