const amqp = require('amqplib');

module.exports = class MessageBroker {
    /**
     * Initialize connection to rabbitMQ
     */
    constructor() {
        this.channel = null;
        this.connection = null;
        this.connections = [];
        this.queue = process.env.QUEUE_NAME;
        this.exchange = process.env.EXCHANGE_NAME;
        this.routingKey = 'routing-key';
    }

    /**
     * initialize the environment
     */
    async init() {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
            this.connections.push(connection);
            this.connection = connection;
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchange, 'direct', { durable: true })
            await this.channel.assertQueue(this.queue, { durable: true });
            await this.channel.bindQueue(this.queue, this.exchange, this.routingKey);
        }
        catch (error) {
            throw new Error(`Error in queueing mechanism initialization: ${error.message}`);
        }
    }

    /**
     * send the message to the exchange and process the messages that already exist in the queue
     * @param {Buffer} bufferedMessage message to the queue as Buffer
     * @param {Function} handler function for processing the messages from the queue
     */
    async execute({ bufferedMessage, handler }) {
        await this.send({ bufferedMessage });
        await this.consume({ handler });
    }

    /**
     * Send message to the exchange and from there to the queue
     * @param {String} queue Queue name
     * @param {Buffer} bufferedMessage Message as Buffer
     */
    async send({ bufferedMessage }) {
        try {
            if (!this.connection) {
                await this.init();
            }
            await this.channel.publish(this.exchange, this.routingKey, bufferedMessage);
        } catch (error) {
            throw new Error(`Error in message sending ${error.message}`);
        }
    }

    /**
     * consume and process the messages from the queue
     * @param {Function} handler function for processing the messages from the queue
     */
    async consume({ handler }) {
        try {
            await this.channel.consume(this.queue, async (message) => {
                const parsedMessage = JSON.parse(message.content.toString());
                await handler(parsedMessage.identifier, ...parsedMessage.args);
                this.channel.ack(message);
            })
        } catch (error) {
            throw new Error(`Error in message consuming ${error.message}`);
        }
    }

    /**
     * close all active connections
     */
    async close() {
        try {
            this.connections.forEach(async (connection) => {
               await connection.close();
            });

        } catch (error) {
            throw new Error(`Error in channel and collection closing: ${error.message}`);
        }
    }
}
