const mongoose = require('mongoose');
const appConfig = require('./config.app');
const { basicInfo } = require('../lib/loggerLib');

/**
 * MongoDB connection
 */
const MongodbConnect = () => {
	mongoose.connect(appConfig.mongodb_uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mongoose.connection.on('connected', () => {
		basicInfo('MongoDB Connected Successfully...');
	});

	mongoose.connection.on('error', (error) => {
		basicInfo(`Connection Error in MongoDb : ${error}`);
	});

	mongoose.connection.on('disconnected', () => {
		basicInfo('Mongodb Disconnected Successfully...');
	});

	process.on('SIGINT', () => {
		mongoose.connection.close();
		basicInfo('Mongodb disconnected by Application...');
		// console.log("Mongodb disconnected by Application");
		// console.log(process.pid);
		process.kill(process.pid);
		process.exit(0);
	});
};

module.exports = MongodbConnect;
