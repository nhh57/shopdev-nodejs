const {Kafka} = require('kafkajs')

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['10.56.66.54:9092'],
})

const producer = kafka.producer()
const runProducer = async () => {
    await producer.connect()
    await producer.send({
        topic: 'test-topic',
        messages: [
            {value: 'Hello KafkaJS user By HaiNH!'},
        ],
    })

    await producer.disconnect()
}

runProducer().catch((console.error))
