const appConfig = require('./app_config/app.json');
const express = require('express');
const helmet = require('helmet');
const inquire = require('./app_routes/index');
const app = express();

app.port = appConfig.port;

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());

app.use('/', inquire);

app.listen(app.port, function appListener () {
	console.log(`Prime Studios Contact API listening on port ${app.port}.`);
});
