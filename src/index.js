const smartcard = require('smartcard');
const JSON5 = require('json5');
const _ = require('./helper');
const Devices = smartcard.Devices;
const devices = new Devices();


const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);
const wsServer = new WebSocketServer({
	httpServer: server
});

wsServer.on('request', function(request) {
	const connection = request.accept(null, request.origin);
	connection.on('message', function(message) {
		console.log('Received Message:', message.utf8Data);
		// connection.sendUTF('Message from WebSocket server!');
	});
	connection.on('close', function(reasonCode, description) {
		console.log('Client has disconnected.');
	});
});


devices.on('device-activated', event => {
	let currentDevices = event.devices;
	let device = event.device;
	for (let prop in currentDevices) {
		console.log("Devices: " + currentDevices[prop]);
	}
  
	device.on('card-inserted', event => {
		let card = event.card;
		card
			.issueCommand('FFCA000000')
			.then((response) => {

			})
			.catch((error) => {
				console.error(error);
			});
		
		card.on('response-received', event => {
			let ID = event.response.getDataOnly();
			console.log(ID);
			let cardInfo = _.getDB(ID);
			if (cardInfo) {
				console.log(cardInfo)
				wsServer.broadcast(JSON.stringify(cardInfo))
			}
			else {
				console.log("No product found")
			}
		});
	});
	device.on('card-removed', event => {
        console.log(`Card removed`);
    });
});