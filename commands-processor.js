'use strict';

const Readable = require('stream').Readable;

class CommandsProcessor {
    async process(cmd, args) {
        switch (cmd) {
            case 'TimerSubscribe':
                return this._timerSubscribe();
            case 'GetDate':
                return this._getDate(args);
            default:
                throw new Error('Received unsupported command');
        }
    }

    _timerSubscribe() {
        const stream = new Readable({
            read() {}
        });

        const timer = setInterval(() => {
            try {
                const currentTimestamp = Math.floor(Date.now() / 1000);
                stream.push( currentTimestamp.toString() );
            } catch (err) {
                clearInterval(timer);
            }
        }, 1000);

        return stream;
    }

    _getDate(args) {;
        const jsTimestamp = parseInt(args[0]) * 1000;
        if (!jsTimestamp) {
            throw new Error(`CommandsProcessor::_getDate - Invalid Argument ${args[0]}`);
        }

        return (new Date(jsTimestamp).toISOString());
    }
}

module.exports = new CommandsProcessor();
