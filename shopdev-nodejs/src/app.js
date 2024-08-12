require('dotenv').config()
const  { default :helmet } = require('helmet')
const  compression = require('compression')
const express =  require('express')
const morgan = require('morgan')
const app = express()

// console.log(`Process::`,process.env)
// init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
// init db
require('./dbs/init.mongodb')
// init router

//handling error

// const {checkOverload} = require('./helpers/check.connect')
// checkOverload()

app.use(express.json()); // Sử dụng middleware này để xử lý JSON
app.use(express.urlencoded({ extended: true })); // Sử dụng middleware này để xử lý URL-encoded data

app.use('/',require('./routes'))

app.use((req,res,next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error,req,res,next) => {
    const statusCode = error.status || 500
    return  res.status(statusCode).json({
        status : 'error',
        code :statusCode,
        stack:error.stack,
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app

