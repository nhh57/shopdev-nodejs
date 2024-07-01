const express =  require('express')
const morgan = require('morgan')
const app = express()

// init middleware
app.use(morgan("dev"))
// app.use(helmet())
// app.use(compression())
// init db
require('./dbs/init.mongodb.lvo')
// init router

//handling error    



app.get('/',(req,res,next) =>{
    //const strCompress ="Hello"
    return res.status(200).json({
        message: "Hello"
    })
})
module.exports = app

