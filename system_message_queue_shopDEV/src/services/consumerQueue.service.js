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

            // 1. TTL
            // const timeExpried = 15000;
            // setTimeout(() => {
            //     channel.consume(notiQueue, msg => {
            //         console.log(`SEND notificationQueue successfully processed::`, msg.content.toString())
            //         channel.ack(msg)
            //     })
            // }, timeExpried)

            // 2. LOGIC
            channel.consume(notiQueue, msg => {
                try {
                    const numberTest = Math.random()
                    console.log(`number::${numberTest}`)
                    if (numberTest < 0.8) {
                        throw new Error('Send notification failed: HOT FIX')
                    }
                    console.log('SEND notificationQueue successfully processed', msg.content.toString())
                    channel.ack(msg)
                } catch (error) {
                    // console.error('SEND notification error', error)
                    channel.nack(msg, false, false)
                    /*
                        nack: negative acknowledgement
                     */
                }
            })
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