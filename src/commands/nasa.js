
/*A slash command to get nasa pictures
 *Two functions available:
 * getPicture() which returns link containing today's picture
 * getPictureOf(date) which returns link containing picture for a specific date (YYYY-MM-DD)
 *if date is specified in slash command, the second function is called, otherwise the first one
 */

const {SlashCommandBuilder}  = require('@discordjs/builders');

const config = require('../../config/config.json');

const axios = require('axios');

const API_KEY = config.NASA_API_KEY;

const getPicture = async() => {
    return await axios.get('https://api.nasa.gov/planetary/apod?api_key=' + API_KEY)
    .then(response => {
      console.log("Number of responses available left : " + response.headers['x-ratelimit-remaining']);
      return response.data.url;
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  const getPictureOf = async(date) => {
    return await axios.get('https://api.nasa.gov/planetary/apod?api_key=' + API_KEY + '&date=' + date)
    .then(response => {
      console.log("Number of responses available left : " + response.headers['x-ratelimit-remaining']);
      return response.data.url;
    })
    .catch(error => {
      console.log(error.response.data.msg);
    });
  }

module.exports = {
	data: new SlashCommandBuilder()
	.setName('nasapic')
	.setDescription('Uses nasa api to get images')
	.addStringOption(option => option.setName('date')
			.setDescription('YYYY-MM-DD')
			.setRequired(false)),
	async execute(interaction) {
        const date = interaction.options.get("date");
        if(date){
            await getPictureOf(date.value).then(res => {
                interaction.reply(`${res}`);
            }).catch(console.error)
        }
        else{
            await getPicture().then(res => {
                interaction.reply(`${res}`);
            }).catch(console.error)
        }
	},
};

