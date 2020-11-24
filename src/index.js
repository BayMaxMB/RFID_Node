const smartcard = require('smartcard');
const _ = require('./helper');
const Devices = smartcard.Devices;
const devices = new Devices();

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
			 }).catch((error) => {
				 console.error(error);
			 });

		card.on('response-received', event => {
			// var d = moment();
			var ID = event.response.getDataOnly();
			console.log(ID)
			console.log(_.getDB(ID))
		});
	});
});