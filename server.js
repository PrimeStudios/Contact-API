const appConfig = require('./app_config/app.json');
const cors = require('./app_modules/cors');
const express = require('express');
const fs = require('fs');
const helmet = require('helmet');
const https = require('https');
const inquire = require('./app_routes/index');
const app = express();

const options = {
	ca: [ fs.readFileSync('../xampp/apache/ssl/primestudios_co-1.ca'), fs.readFileSync('../xampp/apache/ssl/primestudios_co-2.ca'), fs.readFileSync('../xampp/apache/ssl/primestudios_co-3.ca') ],
	cert: fs.readFileSync('../xampp/apache/ssl/primestudios_co.crt'),
	key: fs.readFileSync('../xampp/apache/ssl/privatekey.pem')
};

app.port = appConfig.port;

app.use(cors);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(helmet());

app.use('/', inquire);

const server = https.createServer(options, app);

app.listen(app.port, function appListener () {
	console.log(`Prime Studios Contact API listening on port ${app.port}.`);
});
