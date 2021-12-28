const axios = require('axios');

const PLUG_ENDPOINT = 'http://192.168.2.141';

const sendRequest = async cmd => {
	const { data } = await axios.get(`${PLUG_ENDPOINT}/cm?cmnd=${cmd}`);
	if (!data) throw new Error("Couldn't get any data");
	return data;
};

let cachedPower;

setInterval(async () => {
	const data = await sendRequest('Status%208');
	const currentPower = data.StatusSNS.ENERGY.Power;

	if (data.StatusSNS.ENERGY.Voltage === 0) return;

	if (currentPower <= 5 && cachedPower <= 5) {
		await sendRequest('Power%20OFF');
		console.log('The power plug has been switched off.');
		cachedPower = undefined;
		return;
	}

	cachedPower = currentPower;
}, 30000);
