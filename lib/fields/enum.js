'use strict'

const Field = require('./field')

/**
 * An enum field. It accepts only specified strings.
 *
 * @example
 *      const field = new EnumField([ 'one', 'two', 'three' ])
 *
 *      field.deserialize('one') // returns "one"
 *      field.deserialize('TWO') // returns "two"
 *      field.deserialize('six') // throws validation error
 */
class EnumField extends Field {
    /**
     * @param {string[]} choices - list of possible choices
     * @param {object} [params]
     * @param {boolean} [params.caseSensitive] - makes validation case sensitive
     * @param {boolean} [params.required]
     * @param {string} [params.default]
     */
    constructor(choices, params) {
        super(choices, params)
    }

    init(choices, params) {
        super.init(params)

        if (!choices) {
            throw new Error('Choices list is missing')
        }

        if (!choices.length) {
            throw new Error('Choices list cannot be empty')
        }

        if (choices.find(c => typeof c !== 'string')) {
            throw new Error('All choices must be a strings')
        }

        const choicesMap = {}

        for (const choice of choices) {
            if (this.params.caseSensitive) {
                choicesMap[choice.trim()] = choice
            } else {
                choicesMap[choice.trim().toLowerCase()] = choice
            }
        }

        if (Object.keys(choicesMap).length !== choices.length) {
            throw new Error('Choices cannot be doubled')
        }

        if (this.params.default !== undefined && choices.indexOf(this.params.default) === -1) {
            throw new Error('Default value must be one of choices')
        }

        this.choices = choices
        this.choicesMap = choicesMap
    }

    deserialize(value) {
        value = value.trim()

        if (!this.params.caseSensitive) {
            value = value.toLowerCase()
        }

        if (!this.choicesMap.hasOwnProperty(value)) {
            throw new Field.ValidationError('Value must be one of allowed choices: ' + this.choices.join(', '))
        }

        return this.choicesMap[value]
    }
}

module.exports = EnumField
