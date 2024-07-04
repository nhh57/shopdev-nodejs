require('dotenv').config()
const  { default :helmet } = require('helmet')
const  compression = require('compression')
const express =  require('express')
const morgan = require('morgan')
const app = express()

console.log(`Process::`,process.env)
// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
// init db
require('./dbs/init.mongodb')
// init router

//handling error    

const {checkOverload} = require('./helpers/check.connect')
checkOverload()
app.get('/',(req,res,next) =>{
    //const strCompress ="Hello"
    return res.status(200).json({
        message: "Hello"
    })
})
module.exports = app

