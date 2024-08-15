const amqp = require('amqplib')
const message = 'new a product: Title abcxyz';
const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://10.56.66.54')
        const channel = await connection.createChannel()

        const notificationExchange = 'notificationExchange' //notificationExchange direct
        const notiQueue = 'notificationQueueProcess' //asserQueue
        const notificationExchangeDLX = 'notificationExchangeDLX' //notificationExchangeDLX direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' // assert

        // 1. create Exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })
        // 2. create Queue
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phep cac ket noi khac truy cap vap cung 1 hang doi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // 3. bindQueue
        await channel.bindQueue(queueResult.queue, notificationExchange)


        //4. send Message
        const msg = 'a new Product'
        console.log(`producer msg::${msg}`)
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })

        setTimeout(() => {
            connection.close()
            process.exit(0)
        }, 500);
    } catch (error) {
        console.error(`error::`, error)
    }
}

runProducer().then(rs => console.log(rs)).catch(console.error)