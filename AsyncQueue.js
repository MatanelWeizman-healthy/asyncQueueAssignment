const MessageBroker = require('./MessageBroker');

module.exports = class AsyncQueue {
    constructor(asyncFunc) {
        this.asyncFunc = asyncFunc;
        this.broker = new MessageBroker();
    }

    /**
     * execute and send the data to the broker that implements the asyncQueue
     * @param {String} identifier the identifier of the element that will added to the asyncQueue
     * @param  {...any} args the payload that will send to the asyncQueue
     */
    async add(identifier, ...args) {
        try {
            await this.broker.init();
            const argumentsAsObject = {
                identifier,
                args
            }
            await this.broker.execute({
                bufferedMessage: Buffer.from(JSON.stringify(argumentsAsObject)),
                handler: this.asyncFunc
            });
        } catch (error) {
            throw new Error(error.message);
        }
    }
}