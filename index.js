'use strict';

const net = require('net');
const WebSocket = require('ws');
const GatewayComponent = require('./gateway-component');

const commandsProcessor = require('./commands-processor');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    const gateway = new GatewayComponent(commandsProcessor);

    ws.on('message', (message) => {
        gateway.onRequest(message);
    });

    gateway.on('data', (response) => {
        ws.send(response);
    });
});

const server = net.createServer((socket) => {
    let gateway = new GatewayComponent(commandsProcessor);

    socket.on('data', (data) => {
        gateway.onRequest(data);
    });

    gateway.on('data', (response) => {
        socket.write(response);
    });
}).listen(5000);
