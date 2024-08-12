'use strict'

const mongoose = require('mongoose')
const {db :{host, name, port}} = require('../config/config.mongodb')
const connectString = `mongodb://${host}:${port}/${name}`

const {countConnect} = require('../helpers/check.connect')


console.log(`connectString :`,connectString)

class Database{
    constructor(){
        this.connect()
    }
    // connect
    connect(type = 'mongodb'){
        if(1 ===1){
            mongoose.set('debug',true)
            mongoose.set('debug',{color: true})
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(_ => {
            console.log(`Connect MongoDB Success Pro`),countConnect()})
    .catch(err => console.log(`Error Connect!`))
    }

    static getInstance(){
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongoDB = Database.getInstance()

module.exports = instanceMongoDB