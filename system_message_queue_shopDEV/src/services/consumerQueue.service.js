'use strict'
const {
    connectToRabbitMQForTest,
    connectToRabbitMQ,
    consumerQueue
} = require('../dbs/init.rabbitmq')

const messageService = {
    consumerToQueue: async (queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()
            await consumerQueue(channel, queueName)
        } catch (error) {
            console.error(`error consumerToQueue::`, error)
        }
    },
    // case processing
    consumerToQueueNormal: async (queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()

            const notiQueue = 'notificationQueueProcess' // asserQueue

            const timeExpried = 15000;
            setTimeout(() => {
                channel.consume(notiQueue, msg => {
                    console.log(`SEND notificationQueue successfully processed::`, msg.content.toString())
                    channel.ack(msg)
                })
            }, timeExpried)
        } catch (error) {
            console.error(error);
        }
    },

    consumerToQueueFailed: async (queueName) => {
        try {
            const {channel, connection} = await connectToRabbitMQ()

            const notificationExchangeDLX = 'notificationExchangeDLX' //notificationExchangeDLX direct
            const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // assert
            const notiQueueHandler = 'notificationQueueHotFix';

            await channel.assertExchange(notificationExchangeDLX, 'direct', {
                durable: true
            })

            const queueResult = await channel.assertQueue(notiQueueHandler, {
                exclusive: false
            })

            await channel.bindQueue(queueResult.queue, notificationExchangeDLX, notificationRoutingKeyDLX)
            await channel.consume(queueResult.queue, msgFaild => {
                console.log(`this notification error, pls hot fix::`, msgFaild.content.toString())
            }, {
                noAck: true
            })

        } catch (error) {
            console.error(error)
            throw error;
        }
    }
}


module.exports = messageService