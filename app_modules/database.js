const databaseConfig = require('../app_config/database.json');
const mysql = require('mysql');

const connection = mysql.createPool({
	connectionLimit: 10,
	host: databaseConfig.hostname,
	port: databaseConfig.port,
	user: databaseConfig.user,
	password: databaseConfig.password,
	database: databaseConfig.database
});

const instance = (sql) => {
	return new Promise((resolve, reject) => {
		connection.query(sql, (error, result) => {
			if (!error) {
				return resolve(result);
			} else {
				return reject(error);
			}
		});
	});
};

module.exports = instance;
