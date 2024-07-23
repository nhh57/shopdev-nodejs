'use strict'

const _ = require('lodash')

const getInfoData = ({fields = [], object = {}}) => {
    return _.pick(object, fields)
}

// ['a','b'] =>{a:1,b:1}
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}

const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}


const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => {
        if (obj[key] == null) {
            delete obj[key]
        }
    })
    return obj
}

const updateNestedObjectParser = obj => {
    console.log(`[1]::`,obj)
    const final = {}
    Object.keys(obj).forEach(key => {
        console.log(`[3]::`,key)
        if (typeof obj[key] == 'object' && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key])
            Object.keys(response).forEach(k => {
                console.log(`[4]::`,k)
                final[`${key}.${k}`] = response[k]
            })
        }
        else {
            final[key] = obj[key]
        }
    })
    console.log(`[2]::`,final)
    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    unGetSelectData,
    removeUndefinedObject,
    updateNestedObjectParser
}

