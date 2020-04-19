const appConfig = require('./app_config/app.json');
const database = require('./app_modules/database');
const hookConfig = require('./app_config/hook.json');
const hook = `${hookConfig.protocol}://${hookConfig.host}${hookConfig.route}`;
const request = require('request-promise');
const sanitize = require('sanitize')();

var id;

setInterval(async () => {
	try {
		let unprocessedRequests = await database('SELECT * FROM requests WHERE processed = 0');
		if (unprocessedRequests.length > 0) {
			return new Promise((resolve, reject) => {
				var inquiry = {
					name: sanitize.value(unprocessedRequests[0].name, 'str'),
					email: sanitize.value(unprocessedRequests[0].email, 'str'),
					webDesign: sanitize.value(unprocessedRequests[0].webdesign, 'int'),
					sysAdmin: sanitize.value(unprocessedRequests[0].sysadmin, 'int'),
					seo: sanitize.value(unprocessedRequests[0].seo, 'int'),
					budget: sanitize.value(unprocessedRequests[0].budget, 'str'),
					comments: sanitize.value(unprocessedRequests[0].comments, 'str')
				};
				id = unprocessedRequests[0].id;
				resolve(inquiry);
			}).then((inquiry) => {
				var requirements = '';
				if (inquiry.webDesign) {
					requirements += 'Web Development \\n ';
				}
				if (inquiry.sysAdmin) {
					requirements += 'System Administration \\n ';
				}
				if (inquiry.seo) {
					requirements += 'Search Engine Optimization \\n ';
				}
				if (requirements.length < 1) {
					requirements = 'None Specified';
				}
				inquiry.requirements = requirements;
				return inquiry;
			})
				.then((inquiry) => {
					if (!inquiry.budget) {
						inquiry.budget = 'None Specified';
					}
					if (!inquiry.comments) {
						inquiry.comments = 'None Specified';
					}
					return inquiry;
				})
				.then((inquiry) => {
					const time = new Date();
					const year = time.getFullYear();
					const month = ('0' + (time.getMonth() + 1)).slice(-2);
					const date = ('0' + time.getDate()).slice(-2);
					const hour = ('0' + time.getHours()).slice(-2);
					const minute = ('0' + time.getMinutes()).slice(-2);
					const second = ('0' + time.getSeconds()).slice(-2);
					const timestamp = `${year}-${month}-${date}T${hour}:${minute}:${second}.000Z`;

					inquiry.timestamp = timestamp;
					return inquiry;
				})
				.then((inquiry) => {
					if (inquiry.name && inquiry.email) {
						return inquiry;
					} else {
						database(`UPDATE requests SET processed = 1 WHERE id = ${id}`);

						const err = new Error('Missing Client Information');

						throw err;
					}
				})
				.then((inquiry) => {
					const payload = `{
"embeds": [
	{
		"title": "New Inquiry",
		"fields": [
			{
				"name": "Name",
				"value": "${inquiry.name}"
			},
			{
				"name": "Email Address",
				"value": "${inquiry.email}"
			},
			{
				"name": "Requirements",
				"value": "${inquiry.requirements}",
				"inline": true
			},
			{
				"name": "Budget",
				"value": "${inquiry.budget}",
				"inline": true
			},
			{
				"name": "Comments",
				"value": "> ${inquiry.comments}"
			}
		],
		"color": 16426522,
		"url": "https://primestudios.co/contact/",
		"author": {
			"name": "Prime Studios",
			"url": "https://primestudios.co/",
			"icon_url": "https://primestudios.co/assets/img/logo.png"
		},
		"footer": {
			"text": "Inquiry",
			"icon_url": "https://static.thenounproject.com/png/545046-200.png"
		},
		"timestamp": "${inquiry.timestamp}"
	}
]
}`;

					return JSON.parse(payload);
				})
				.then((payload) => {
					var options = {
						method: 'POST',
						uri: hook,
						body: payload,
						json: true
					};

					return request(options);
				})
				.then((err, response) => {
					if (!err) {
						console.log(`Checked Database for Unprocessed Requests and processed one.`);
						return null;
					} else {
						throw err;
					}
				})
				.then((state) => {
					return database(`UPDATE requests SET processed = 1 WHERE id = ${id}`);
				})
				.catch((err) => {
					throw err;
				});
		} else {
			console.log(`Checked Database for Unprocessed Requests and found none.`);
		}
	} catch (error) {
		console.log(`An Error occured: ${error.message}.`);
	}
}, appConfig.interval);
