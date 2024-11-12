'use strict'
const amqplib = require('amqplib')
const amqp_url = 'amqp://10.56.66.54:5672'

const sendQueue = async({ message }) => {
    try {
        // 1 create connect
        const conn = await amqplib.connect(amqp_url)
            // 2. create channel
        const channel = await conn.createChannel()
            // 3. create queue name
        const nameQueue = 'q1'
            // 4. create queue
        await channel.assertQueue(nameQueue, {
                durable: false
            })
            //5. send to queue
        await channel.sendToQueue(nameQueue, Buffer.from(message))
            // 6. close connect and channel
    } catch (error) {
        console.error(`Error::`, error.message)
    }
}
sendQueue({ message: 'Hai pro' })