'use strict';

const assert = require('assert');
const WebSocket = require('ws');
const commandServer = require('./../index');

describe('GatewayComponent test', function() {
    let ws;

    before((done) => {
        ws = new WebSocket('ws://localhost:8080', {
            perMessageDeflate: false
        });

        ws.on('open', () => done() );
    });

    it('Server returns timer values prefixed with command name, after sending TimerSubscribe command', function(done) {
        const listener = (msg) => {
            console.log(msg);
            assert.ok( /^TimerSubscribe: \d+[\r\n]$/.test(msg) );
        }

        ws.on('message', listener);

        ws.send('TimerSubscribe');

        setTimeout(() => {
            ws.removeListener('message', listener);
            done();
        }, 5000);
    });

    it('Server returns ISO date prefixed with command name and id, after sending GetDate command', function(done) {
        const listener = (msg) => {
            console.log(msg);
            assert.ok( /^GetDate:123: .+[\r\n]$/.test(msg) );
            done();
        }

        ws.on('message', listener);

        ws.send('GetDate:123 1541399693');
    });
});
