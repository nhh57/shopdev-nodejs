const amqp = require('amqplib')
const message = 'new a product: Title abcxyz';
const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://10.56.66.54')
        const channel = await connection.createChannel()
        const queueName = 'test-topic'
        await channel.assertQueue(queueName, {
            durable: true
        })
        //send message to consumer channel
        channel.sendToQueue(queueName, Buffer.from(message))
        console.log(`message sent::`, message)
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(console.error)