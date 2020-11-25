const fs = require('fs');
const JSON5 = require('json5');
const config = require('./config');
const dbAdress = config.DBAdress;

function readDB() {
	let db = {};
	try {
		db = JSON5.parse(fs.readFileSync(dbAdress, 'utf-8'));
	}
	catch (e) {
        console.log(e)
	}
	return db;
}

module.exports = {
	getDB(id) {
		const db = readDB();
        return (db[id]);
	},
}