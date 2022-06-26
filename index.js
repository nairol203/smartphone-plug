const axios = require('axios');
const { setTimeout } = require('timers/promises');

const POWER_THRESHOLD = 5;

const getPower = async () => {
	try {
		const { data } = await axios('http://192.168.2.141/cm?cmnd=Status%208');
		const voltage = data.StatusSNS.ENERGY.Voltage;
		const power = data.StatusSNS.ENERGY.Power;
		console.log('Request successful', `Voltage: ${voltage}`, `Power: ${power}`);

		if (voltage === 0) return undefined;
		return power;
	} catch (error) {
		console.log('Request failed', error);
	}
};

setInterval(async () => {
	const power1 = await getPower();
	await setTimeout(30000);
	const power2 = await getPower();

	if (isNaN(power1) || isNaN(power2)) return console.log(`Power undefined`, power1, power2);
	if (power1 > POWER_THRESHOLD || power2 > POWER_THRESHOLD) return console.log('Power above threshold', power1, power2);

	await axios('http://192.168.2.141/cm?cmnd=Power%20OFF');
	console.log('The power plug has been switched off.', power1, power2);
}, 30000);
