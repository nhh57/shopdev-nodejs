'use strict';
const amqp = require('amqplib')
const connectToRabbitMQ = async () => {
    try {
        const connection = await amqp.connect('amqp://10.56.66.54')
        if (!connection) throw new Error('Connection not established')
        const channel = await connection.createChannel();
        return {channel, connection}
    } catch (error) {

    }
}
const connectToRabbitMQForTest = async () => {
    try {
        const {channel, connection} = await connectToRabbitMQ();

        //Publish message to a queue
        const queue = 'test-queue'
        const message = 'Hello, shopDev by hainh'
        await channel.assertQueue(queue)
        await channel.sendToQueue(queue, Buffer.from(message))

        //close the connection
    } catch (error) {
        console.error(error)
    }
}

const consumerQueue = async (channel, queueName) => {
    try {
        await channel.assertQueue(queueName, {durable: true})
        console.log(`awaiting for message...`);
        channel.consume(queueName, msg => {
            console.log(`Received message : ${queueName}::`, msg.content.toString())
            // 1.find user following table SHOP
            // 2. send message to user
            // 3. yes, ok => success
            // 4. error, setup DLX ...
        }, {
            noAck: false
        })
    } catch (error) {
        console.error(`error publish message to rabbitMQ::`, error)
        throw error;
    }
}

module.exports = {
    consumerQueue,
    connectToRabbitMQ,
    connectToRabbitMQForTest
}

