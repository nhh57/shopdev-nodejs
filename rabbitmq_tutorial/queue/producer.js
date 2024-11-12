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
        const nameQueue = 'q2'
            // 4. create queue
        await channel.assertQueue(nameQueue, {
                durable: true
            })
            //5. send to queue
        await channel.sendToQueue(nameQueue, Buffer.from(message), {
                persistent: true,
                expiration: '1000'
            })
            // 6. close connect and channel
    } catch (error) {
        console.error(`Error::`, error.message)
    }
}
const msg = process.argv.slice(2).join('') || 'Hello';
console.log(`msg::%s`, msg);

sendQueue({ message: msg })