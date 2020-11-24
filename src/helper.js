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
		fs.writeFileSync(dbAdress, JSON5.stringify({}, null, '\t'));
		readDB();
	}
	return db;
}

module.exports = {
    addDB(chatID, id, newUsers) {
		const newUsers_IDs = newUsers.map((el) => (!(el.is_bot)) ? el.id : false).filter(x => x);
		if (newUsers_IDs.length != 0) {
			const db = readDB();
			if (db[chatID] == undefined) {
				db[chatID] = {};
				// db[chatID][id] = newUsers_IDs;
			}
			else if (db[chatID][id] == undefined) {
				db[chatID][id] = newUsers_IDs;
			}
			else {
				db[chatID][id] = [...new Set(db[chatID][id].concat(newUsers_IDs))];
			}
			fs.writeFileSync(dbAdress, JSON5.stringify(db, null, '\t'));
		}
	},
	
	delDB(chatID, id, leftID) {
		const db = readDB();
		if(db[chatID] != undefined) {
			Object.keys(db[chatID]).some(adder => {
				const target_index = db[chatID][adder].indexOf(leftID);
				if (target_index != -1) {
					db[chatID][adder].splice(target_index, 1);
					if (db[chatID][adder].length == 0) {
						delete db[chatID][adder];
						if (Object.keys(db[chatID]).length == 0) {
							delete db[chatID];
						}
					}
					return true;
				}
			});
			fs.writeFileSync(dbAdress, JSON5.stringify(db, null, '\t'));
		}
	},

	getDB(id) {
		const db = readDB();
        return (db[id]);
	},
}