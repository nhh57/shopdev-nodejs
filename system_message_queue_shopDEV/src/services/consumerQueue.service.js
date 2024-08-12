'use strict'
const {
    connectToRabbitMQForTest,
    connectToRabbitMQ,
    consumerQueue
} = require('../dbs/init.rabbitmq')


const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const {channel,connection} = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`error consumerToQueue::`, error)
        }
    }
}


module.exports = messageService