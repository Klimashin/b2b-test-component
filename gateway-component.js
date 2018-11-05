'use struct';

const EventEmitter = require('events');
const Readable = require('stream').Readable;

class GatewayComponent extends EventEmitter {
    constructor(requestsHandler) {
        super();
        this.requestsHandler = requestsHandler;
    }

    /*
    Commands format: <Command> <arg1> <arg2> ...
    Optinal, with id: <Command>:<ID> <arg1> <arg2> ...
     */
    async onRequest(data) {
        try {
            const [commandPart, ...args] = data.toString('utf8').match(/\S+/g) || [];
            const [cmd, id] = commandPart.split(':');

            const cmdResponse = await this.requestsHandler.process(cmd, args);

            if (cmdResponse instanceof Readable) {
                return cmdResponse.on('data', (data) => {
                    this.emit('data', this._buildResponseMsg(data, cmd, id) );
                });
            }

            return this.emit('data', this._buildResponseMsg(cmdResponse, cmd, id) );
        } catch (err) {
            console.log(err);
            this.emit('error', `Error ${err} occured whilre processing message ${data}.`);
        }
    }

    _buildResponseMsg(data, cmd, id) {
        if (id) {
            return `${cmd}:${id}: ${data}\n`;
        }

        return `${cmd}: ${data}\n`;
    }
}

module.exports = GatewayComponent;
