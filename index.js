const axios = require('axios');

let cachedPower;

setInterval(async () => {
	const { data } = await axios('http://192.168.2.141/cm?cmnd=Status%208');
	const power = data.StatusSNS.ENERGY.Power;

	if (data.StatusSNS.ENERGY.Voltage === 0) return;

	if (power <= 5 && cachedPower <= 5) {
		await axios('http://192.168.2.141/cm?cmnd=Power%20OFF');
		console.log('The power plug has been switched off.');
		cachedPower = undefined;
		return;
	}

	cachedPower = power;
}, 30000);
