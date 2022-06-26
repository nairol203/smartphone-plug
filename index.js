const axios = require('axios');

const POWER_THRESHOLD = 5;
let cachedPower;

setInterval(async () => {
	const req = await axios('http://192.168.2.141/cm?cmnd=Status%208').catch(() => null);
	const voltage = req?.data?.StatusSNS?.ENERGY?.Voltage;
	const power = req?.data?.StatusSNS?.ENERGY?.Power;

	if (!voltage) return console.log('Power plug not available or turned off');

	if (power <= POWER_THRESHOLD && cachedPower <= POWER_THRESHOLD) {
		await axios('http://192.168.2.141/cm?cmnd=Power%20OFF');
		console.log('The power plug has been switched off.');
		cachedPower = undefined;
		return;
	}

	console.log(power, cachedPower);

	cachedPower = power;
}, 30000);
