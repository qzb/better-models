/* global describe, it */
'use strict';

const expect = require('chai').expect;
const Field = require('../lib/fields/field');
const IntegerField = require('../lib/fields/integer');
const StringField = require('../lib/fields/string');
const Model = require('../lib/model');

describe('Model', function () {
    describe('constructor', function () {
        it('should throw error when try to create instance of Model directly', function () {
            let call = () => new Model({});

            expect(call).to.throw('You can only create instances of subclasses of Model');
        });

        it('should create instance of subclass of Model', function () {
            let DataModel = class extends Model {};
            let model = new DataModel({});

            expect(model).to.be.instanceOf(DataModel);
            expect(model).to.be.instanceOf(Model);
        });

        it('should deserialize fields', function () {
            class IncrField extends Field {
                deserialize(value) {
                    return value + 1;
                }
            }

            let DataModel = class extends Model {};
            DataModel.prototype.field1 = new IncrField();
            DataModel.prototype.field2 = new IncrField();

            let model = new DataModel({ field1: 1, field2: 2 });

            expect(model).to.have.property('field1', 2);
            expect(model).to.have.property('field2', 3);
        });

        it('should ignore all non-field related properties from specified data object', function () {
            let DataModel = class extends Model {};

            let model = new DataModel({ field1: 1, field2: 2 });

            expect(model).to.not.have.property('field1');
            expect(model).to.not.have.property('field2');
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

        it('should copy all properties to prototype', function () {
            let props = {
                a: 5,
                b: () => 5,
                get c() { return 5; }
            };
            let DataModel = Model.extend(props);

            expect(DataModel.prototype).to.have.ownPropertyDescriptor('a', Object.getOwnPropertyDescriptor(props, 'a'));
            expect(DataModel.prototype).to.have.ownPropertyDescriptor('b', Object.getOwnPropertyDescriptor(props, 'b'));
            expect(DataModel.prototype).to.have.ownPropertyDescriptor('c', Object.getOwnPropertyDescriptor(props, 'c'));
        });
    });

    describe('getErrors method', function () {
        it('should get all errors', function () {
            class InvalidField extends Field {
                deserialize(value) {
                    throw new Error(value);
                }
            }

            let DataModel = class extends Model {};
            DataModel.prototype.field1 = new InvalidField();
            DataModel.prototype.field2 = new InvalidField();

            let model = new DataModel({ field1: 'abc', field2: 'def', field3: 12 });
            let errors = model.getErrors();

            expect(errors).to.have.property('field1', 'abc');
            expect(errors).to.have.property('field2', 'def');
            expect(errors).to.not.have.property('field3');
        });

        it('should return null when there is no errors', function () {
            let DataModel = class extends Model {};
            DataModel.prototype.field1 = new Field();
            DataModel.prototype.field2 = new Field();

            let model = new DataModel({ field1: 12, field2: false });
            let errors = model.getErrors();

            expect(errors).to.be.null;
        });
    });

    describe('toJSON method', function () {
        it('should serialize model\'s fields', function () {
            let DataModel = class extends Model {};
            DataModel.prototype.field1 = new Field();
            DataModel.prototype.field2 = new Field();

            let model = new DataModel({ field1: 'abc', field2: 12 });
            let json = model.toJSON();

            expect(json).to.have.property('field1', 'abc');
            expect(json).to.have.property('field2', 12);
        });

        it('should copy values of non-field properties and getters', function () {
            let DataModel = class extends Model {
                constructor() {
                    super();
                    this.field1 = 'abc';
                }

                get field2() {
                    return 12;
                }
            };

            let model = new DataModel({});
            let json = model.toJSON();

            expect(json).to.have.property('field1', 'abc');
            expect(json).to.have.property('field2', 12);
        });
    });
});