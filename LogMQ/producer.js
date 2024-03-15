const amqp = require('amqplib')
const config = require('./config')
//  step 1 : connect to the rabbitMq server
//  step 2 : create new channel on that connection
//  step 3 : create the exchange
//  step 4 : publish the message to the exchange with a routing key

class Producer {
    channel;

    async createChannel() {
        const connection = await amqp.connect(config.rabbitMQ.url);
        this.channel = await connection.createChannel();
    }

    async publishMessage(routingKey, message) {
        if (!this.channel) {
            await this.createChannel()
        }
        const exchangeName = config.rabbitMQ.exchangeName;
        await this.channel.assertExchange(exchangeName, "direct");

        const logDetails = {
            logType: routingKey,
            message: message,
            dateTime: new Date(),
        }
        await this.channel.publish(
            exchangeName,
            routingKey,
            Buffer.from(JSON.stringify({logDetails}))
        );

        console.log(`the message ${message} is sent to exchange ${exchangeName} and routing key is ${routingKey}`);
    }

}
module.exports = Producer;