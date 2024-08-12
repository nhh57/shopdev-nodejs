'use strict'

const mongoose = require('mongoose')

const connectString = `mongodb://10.56.66.54:27017/shopDEV`

mongoose.connect( connectString ).then(_ => console.log(`Connect MongoDB Success`))
.catch(err => console.log(`Error Connect!`))

// dev
if(1 === 0){
    mongoose.set('debug',true)
    mongoose.set('debug', {color: true})
}

module.exports = mongoose