'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const EnumField = require('../../lib/fields/enum');

describe('EnumField', function() {
    describe('constructor', function() {
        it('should create new instance of field', function() {
            const field = new EnumField([ 'one' ]);

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(EnumField);
        });

        it('should create new instance of field when all params are specified', function() {
            const field = new EnumField([ 'one' ], {
                default: 'one',
                optional: true,
                caseSensitive: true
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(EnumField);
        });

        it('should throw error when list of choices is missing', function () {
            const call = () => new EnumField();

            expect(call).to.throw(Error, 'Choices list is missing');
        });

        it('should throw error when list of choices is empty', function () {
            const call = () => new EnumField([]);

            expect(call).to.throw(Error, 'Choices list cannot be empty');
        });

        it('should throw error when some choices are doubled', function () {
            const call = () => new EnumField([ 'one', 'two', 'one' ]);

            expect(call).to.throw(Error, 'Choices cannot be doubled');
        });

        it('should throw error when two choices are the same after trimming', function () {
            const call = () => new EnumField([ 'one', 'two', ' one ' ]);

            expect(call).to.throw(Error, 'Choices cannot be doubled');
        });

        it('should throw error when two choices differs in case only nad caseSensitive option is disabled', function () {
            const call = () => new EnumField([ 'one', 'two', 'ONE' ]);

            expect(call).to.throw(Error, 'Choices cannot be doubled');
        });

        it('should\'t throw error when two choices differs in case and caseSensitive options is enabled', function () {
            const call = () => new EnumField([ 'one', 'two', 'ONE' ], { caseSensitive: true });

            expect(call).to.not.throw(Error, 'Choices cannot be doubled');
        });

        it('should throw error when some of specified choices aren\'t strings', function() {
            const call = () => new EnumField([ 'one', 'two', 3 ]);

            expect(call).to.throw(Error, 'All choices must be a strings');
        });

        it('should throw error when default value is not one of choices', function() {
            const call = () => new EnumField([ 'one', 'two' ], { default: 'three' });

            expect(call).to.throw(Error, 'Default value must be one of choices');
        });
    });

    describe('deserialize method', function() {
        it('should deserialize value', function() {
            const field = new EnumField([ 'one' ]);
            const result = field.deserialize('one');

            expect(result).to.be.equal('one');
        });

        it('should deserialize untrimmed values', function() {
            const field = new EnumField([ 'one' ]);
            const result = field.deserialize('\t  one  \n');

            expect(result).to.be.equal('one');
        });

        it('should deserialize value with invalid case', function() {
            const field = new EnumField([ 'ONE' ]);
            const result = field.deserialize('one');

            expect(result).to.be.equal('ONE');
        });

        it('should throw error when value has invalid case and caseSensitive option is enabled', function () {
            const field = new EnumField([ 'ONE' ], { caseSensitive: true });
            const call = () => field.deserialize('one');

            expect(call).to.throw(Field.ValidationError, 'Value must be one of allowed choices: ONE');
        });

        it('should throw error when value is not one of choices', function () {
            const field = new EnumField([ 'one', 'two' ]);
            const call = () => field.deserialize('three');

            expect(call).to.throw(Field.ValidationError, 'Value must be one of allowed choices: one, two');
        });
    });
});