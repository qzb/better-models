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
            let DataModel = class extends Model {};
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

            let DataModel = class extends Model {};
            DataModel.prototype.field = new CustomField();

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

            let DataModel = class extends Model {};
            DataModel.prototype.field = new CustomField();

            let model = new DataModel({});

            expect(model).to.have.property('field', 'deserializeBlank');
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
                a: {},
                b: () => 5,
                get c() { return 5; }
            };
            let DataModel = Model.extend(props);

            expect(DataModel.prototype).to.have.ownPropertyDescriptor('a', {
                value: Object.getOwnPropertyDescriptor(props, 'a').value,
                writable: true,
                enumerable: false,
                configurable: true
            });
            expect(DataModel.prototype).to.have.ownPropertyDescriptor('b', {
                value: Object.getOwnPropertyDescriptor(props, 'b').value,
                writable: true,
                enumerable: false,
                configurable: true
            });
            expect(DataModel.prototype).to.have.ownPropertyDescriptor('c', {
                get: Object.getOwnPropertyDescriptor(props, 'c').get,
                set: undefined,
                enumerable: false,
                configurable: true
            });
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

    describe('serialize method', function () {
        it('should serialize not empty fields using serialize method', function () {
            class CustomField extends Field {
                isBlank(value) {
                    return false;
                }

                serialize(value) {
                    return 'serialize';
                }
            }

            let DataModel = class extends Model {};
            DataModel.prototype.field = new CustomField();

            let model = new DataModel({});
            let result = model.serialize();

            expect(result).to.have.property('field', 'serialize');
        });

        it('should serialize empty fields using serializeBlank method', function () {
            class CustomField extends Field {
                isBlank(value) {
                    return true;
                }

                serializeBlank(value) {
                    return 'serializeBlank';
                }
            }

            let DataModel = class extends Model {};
            DataModel.prototype.field1 = new CustomField();
            DataModel.prototype.field2 = new CustomField();

            let model = new DataModel({ field1: true, field2: true });
            model.field1 = null;
            model.field2 = undefined;

            let result = model.serialize();

            expect(result).to.have.property('field1', 'serializeBlank');
            expect(result).to.have.property('field2', 'serializeBlank');
        });

        it('shouldn\'t copy values of non-field properties and getters', function () {
            let DataModel = class extends Model {
                constructor() {
                    super();
                    this.field1 = 'abc';
                }

                get field2() {
                    return 12;
                }
            };
            DataModel.prototype.field3 = true;

            let model = new DataModel({});
            let result = model.serialize();

            expect(result).to.not.have.property('field1');
            expect(result).to.not.have.property('field2');
            expect(result).to.not.have.property('field3');
        });

        it('should copy values of own, non-field properties when "includeProperties" option is enabled', function () {
            let DataModel = class extends Model {
                constructor() {
                    super();

                    Object.defineProperty(this, 'field1', { get: () => 'bar', enumerable: true });

                    this.field2 = 'abc';
                    this.field3 = undefined;
                }

                get field4() {
                    return 'egg';
                }
            };
            DataModel.prototype.field5 = 'spam';

            let model = new DataModel({});
            let result = model.serialize({ includeProperties: true });

            expect(result).to.have.property('field1', 'bar');
            expect(result).to.have.property('field2', 'abc');
            expect(result).to.not.have.property('field3');
            expect(result).to.not.have.property('field4');
            expect(result).to.not.have.property('field5');
        });
    });

    describe('toJSON', function () {
        it('should call serialize method and return it\'s result', function () {
            let DataModel = class extends Model {
                serialize() {
                    return 'serialize';
                }
            };

            let model = new DataModel({});
            let result = model.toJSON();

            expect(result).to.be.equal('serialize');
        });
    });

    describe('getRawData method', function () {
        it('should return data passed to Model\'s constructor', function () {
            let DataModel = class extends Model {};

            let data = { foo: 'bar' };
            let model = new DataModel(data);

            expect(model.getRawData()).to.be.equal(data);
        });
    });

    describe('fields static getter', function() {
        it('should return list of Model\'s fields', function() {
            let DataModel = class extends Model {};
            DataModel.prototype.field1 = new Field();
            DataModel.prototype.field2 = new Field();

            expect(DataModel.fields).to.have.property('field1', DataModel.prototype.field1);
            expect(DataModel.fields).to.have.property('field2', DataModel.prototype.field2);
        });

        it('should return frozen object', function() {
            let DataModel = class extends Model {};

            expect(DataModel.fields).to.be.frozen;
        });

        it('should include inherited fields', function() {
            let ParentModel = class extends Model {};
            let ChildModel = class extends ParentModel {};
            ParentModel.prototype.field1 = new Field();
            ParentModel.prototype.field2 = new Field();
            ChildModel.prototype.field2 = new Field();

            expect(ChildModel.fields).to.have.property('field1', ParentModel.prototype.field1);
            expect(ChildModel.fields).to.have.property('field2', ChildModel.prototype.field2);
            expect(ParentModel.fields).to.have.property('field2', ParentModel.prototype.field2);
        });

        it('should include non-enumerable properties', function () {
            let DataModel = class extends Model {};
            Object.defineProperty(DataModel.prototype, 'field1', {
                value: new Field(),
                enumerable: false
            });

            expect(DataModel.fields).to.have.property('field1', DataModel.prototype.field1);
        });

        it('should allow shadowing parent Model\'s fields with non-field properties', function() {
            let ParentModel = class extends Model {};
            let ChildModel = class extends ParentModel {};
            ParentModel.prototype.field1 = new Field();
            ParentModel.prototype.field2 = new Field();
            ChildModel.prototype.field2 = undefined;

            expect(ChildModel.fields).to.have.property('field1', ParentModel.prototype.field1);
            expect(ChildModel.fields).to.not.have.property('field2');
            expect(ParentModel.fields).to.have.property('field2', ParentModel.prototype.field2);
        });

        it('should not include properties which are not instances of Field', function() {
            let DataModel = class extends Model {};
            DataModel.prototype.field1 = {};
            DataModel.prototype.field2 = 'abc';

            expect(DataModel.fields).to.be.eql({});
        });

        it('should not include getters', function () {
            let DataModel = class extends Model {};

            // Getters defined inside class aren't enumerable, so I've used defineProperty to be sure it works properly.
            Object.defineProperty(DataModel.prototype, 'field2', {
                enumerable: true,
                get: () => new Field()
            });

            expect(DataModel.fields).to.be.eql({});
        });

        it('should not call getters', function () {
            let DataModel = class extends Model {};

            // Getters defined inside class aren't enumerable, so I've used defineProperty to be sure it works properly.
            Object.defineProperty(DataModel.prototype, 'field2', {
                enumerable: true,
                get: () => {
                    throw new Error();
                }
            });

            expect(() => DataModel.fields).to.not.throw();
        });

        it('should cache result after first call', function () {
            let DataModel = class extends Model {};

            DataModel.prototype.field1 = new Field();
            let result1 = DataModel.fields;

            DataModel.prototype.field2 = new Field();
            let result2 = DataModel.fields;

            expect(result1).to.be.equal(result2);
            expect(result2).to.not.have.property('field2');
        });

        it('should trigger caching parent\'s fields', function () {
            let ParentModel = class extends Model {};
            let ChildModel = class extends ParentModel {};

            ParentModel.prototype.field1 = new Field();
            let result1 = ChildModel.fields;

            ParentModel.prototype.field2 = new Field();
            let result2 = ParentModel.fields;

            expect(result1).to.not.be.equal(result2);
            expect(result2).to.not.have.property('field2');
        });
    });
});
