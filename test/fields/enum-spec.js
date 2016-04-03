'use strict';

const expect = require('chai').expect;
const Field = require('../../lib/fields/field');
const EnumField = require('../../lib/fields/enum');

describe('EnumField', function() {
    describe('constructor', function() {
        it('should create new instance of field', function() {
            let field = new EnumField([ 'one' ]);

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(EnumField);
        });

        it('should create new instance of field when all params are specified', function() {
            let field = new EnumField([ 'one' ], {
                default: 'one',
                optional: true,
                caseSensitive: true
            });

            expect(field).to.be.instanceOf(Field);
            expect(field).to.be.instanceOf(EnumField);
        });

        it('should throw error when list of choices is missing', function () {
            let call = () => new EnumField();

            expect(call).to.throw('Choices list is missing');
        });

        it('should throw error when list of choices is empty', function () {
            let call = () => new EnumField([]);

            expect(call).to.throw('Choices list cannot be empty');
        });

        it('should throw error when some choices are doubled', function () {
            let call = () => new EnumField([ 'one', 'two', 'one' ]);

            expect(call).to.throw('Choices cannot be doubled');
        });

        it('should throw error when two choices are the same after trimming', function () {
            let call = () => new EnumField([ 'one', 'two', ' one ' ]);

            expect(call).to.throw('Choices cannot be doubled');
        });

        it('should throw error when two choices differs in case only nad caseSensitive option is disabled', function () {
            let call = () => new EnumField([ 'one', 'two', 'ONE' ]);

            expect(call).to.throw('Choices cannot be doubled');
        });

        it('should\'t throw error when two choices differs in case and caseSensitive options is enabled', function () {
            let call = () => new EnumField([ 'one', 'two', 'ONE' ], { caseSensitive: true });

            expect(call).to.not.throw('Choices cannot be doubled');
        });

        it('should throw error when some of specified choices aren\'t strings', function() {
            let call = () => new EnumField([ 'one', 'two', 3 ]);

            expect(call).to.throw('All choices must be a strings');
        });

        it('should throw error when default value is not one of choices', function() {
            let call = () => new EnumField([ 'one', 'two' ], { default: 'three' });

            expect(call).to.throw('Default value must be one of choices');
        });
    });

    describe('deserialize method', function() {
        it('should deserialize value', function() {
            let field = new EnumField([ 'one' ]);
            let result = field.deserialize('one');

            expect(result).to.be.equal('one');
        });

        it('should deserialize untrimmed values', function() {
            let field = new EnumField([ 'one' ]);
            let result = field.deserialize('\t  one  \n');

            expect(result).to.be.equal('one');
        });

        it('should deserialize value with invalid case', function() {
            let field = new EnumField([ 'ONE' ]);
            let result = field.deserialize('one');

            expect(result).to.be.equal('ONE');
        });

        it('should throw error when value has invalid case and caseSensitive option is enabled', function () {
            let field = new EnumField([ 'ONE' ], { caseSensitive: true });
            let call = () => field.deserialize('one');

            expect(call).to.throw('Value must be one of allowed choices: ONE');
        });

        it('should throw error when value is not one of choices', function () {
            let field = new EnumField([ 'one', 'two' ]);
            let call = () => field.deserialize('three');

            expect(call).to.throw('Value must be one of allowed choices: one, two');
        });
    });
});