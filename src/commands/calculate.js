const { SlashCommandBuilder } = require('@discordjs/builders');

const axios = require('axios');

//Using get request

const calculate = async(expr) => {
    return await axios.get(`http://api.mathjs.org/v4/?expr=${encodeURIComponent(expr)}`)
    .then(response => {return response.data})
    .catch(error => {console.log(error);})
}

//Using post request
/*
const calculate = async (expr) => {
	return await axios.post(`http://api.mathjs.org/v4/`,
	{"expr" : expr},
	{headers: {'content-type': 'application/json'}})
	.then(response => { return response.data.result }).catch(error => { console.log(error); })
}
*/
module.exports = {
	data: new SlashCommandBuilder()
		.setName('calculate')
		.setDescription('Uses math.js api')
		.addStringOption(option => option.setName('expression')
			.setDescription('An expression or conversion')
			.setRequired(true)),
	async execute(interaction) {
		await calculate(interaction.options.get("expression").value).then(res => {
			interaction.reply(`Answer is ${res}.`);
		}).catch(console.error)
	},
};
