'use strict'

const amqp = require('amqplib')
const e = require("express");
const message = 'hello, Rabbitmq for Hainh';
const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://10.56.66.54')
        const channel = await connection.createChannel()
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })
        //send message to consumer channel
        channel.consume(queueName, (message) => {
            console.log(`Received ${message.content.toString()}`);
        }, {
            noAck: true
        })
        console.log(`message sent::`, message)
    } catch (error) {
        console.error(error)
    }
}

runConsumer().catch(console.error)