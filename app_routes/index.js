const discord = require('../app_config/discord.json');
const express = require('express');
const request = require('request-promise');
const router = express.Router();
const sanitize = require('sanitize')();

const hook = discord.hook;

router.post('/', async function inquire (req, res) {
	return new Promise((resolve, reject) => {
		var inquiry = {
			name: sanitize.value(req.query.name, 'str'),
			email: sanitize.value(req.query.email, 'str'),
			webDesign: sanitize.value(req.query.webdesign, 'int'),
			sysAdmin: sanitize.value(req.query.sysadmin, 'int'),
			seo: sanitize.value(req.query.seo, 'int'),
			budget: sanitize.value(req.query.budget, 'str'),
			comments: sanitize.value(req.query.comments, 'str')
		};
		resolve(inquiry);
	}).then((inquiry) => {
		var requirements;
		if (inquiry.webDesign) {
			requirements += 'Web Development\n';
		}
		if (inquiry.sysAdmin) {
			requirements += 'System Administration\n';
		}
		if (inquiry.seo) {
			requirements += 'Search Engine Optimization\n';
		}
		if (!requirements) {
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
			const hour = time.getHours();
			const minute = time.getMinutes();
			const second = time.getSeconds();
			const timestamp = `${year}-${month}-${date}T${hour}:${minute}:${second}.000Z`;

			inquiry.timestamp = timestamp;
			return inquiry;
		})
		.then((inquiry) => {
			if (inquiry.name && inquiry.email) {
				return inquiry;
			} else {
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
				"name": "budget",
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
				res.status(200).json({Message: 'Success'});
				return null;
			} else {
				throw err;
			}
		})
		.catch((err) => {
							console.log(err);
			res.status(400).json({Error: err.message});
		});
});

module.exports = router;
