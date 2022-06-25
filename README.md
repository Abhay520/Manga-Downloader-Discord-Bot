# Manga-Downloader-Discord-Bot

# What the bot does

Discord bot which downloads volumes of your favorite mangas

The bot uses the mangadex.org api to download manga chapters from the volume of your choice, as well as the cover page of that volume, merges them into a pdf file and uploads it to a google drive service account and sends the link to that file on discord
Note: The bot cannot upload the file directly to discord since most volumes are around 25-40 MB (Discord upload limit is 10MB)

The bot requires a manga id, as well as the volume you wish to download

To get the manga id of the manga you want, go to [mangadex.org](https://mangadex.org/), search for the manga of your choice and you will see the id in the url

![image](https://user-images.githubusercontent.com/59373798/175753814-2e670772-1f9d-4e8b-a5a8-ed8447f12960.png)

For example, in the screenshot above, the id is 37f5cce0-8070-4ada-96e5-fa24b1bd4ff9

A discord slash command can then be sent, as shown below

![image](https://user-images.githubusercontent.com/59373798/175753878-a732d582-f031-4aaa-a7c1-dc87065d9fd9.png)

After that, the bot will start downloading your manga and this message will be shown during the download

![image](https://user-images.githubusercontent.com/59373798/175753911-3963abdc-fe9f-4de9-8d3a-90c5219f954d.png)

Downloading a volume usually takes about 6 mins due to mangadex api request limit/min

After that, the bot will send the google link of the manga in pdf, which you can access, read as well as download for yourself

![image](https://user-images.githubusercontent.com/59373798/175753961-7087d4d5-46c5-4598-84dc-ea29951da600.png)

I will leave this link here for the first volume of BERSERK I downloaded using this script

https://drive.google.com/file/d/159ExBz0q58CNlwYIxkdmBok6BqLdx8ZV/view?usp=sharing


# Other random commands

I also made a command to perform mathematical calculations and conversions using the math.js api 
(https://mathjs.org/)
Command example:

![image](https://user-images.githubusercontent.com/59373798/175753992-475d1fc4-c5dc-409e-9abf-546ad85ec2c6.png)

Response:

![image](https://user-images.githubusercontent.com/59373798/175754001-d4329108-7317-436b-8a08-c3307b9eb47d.png)

Command example 2:

![image](https://user-images.githubusercontent.com/59373798/175754012-02ca09d2-d4ec-4127-b277-22ade8dca531.png)

Response:

![image](https://user-images.githubusercontent.com/59373798/175754017-ef0398b5-6382-47e9-96e2-73d6c63db781.png)


Theres also a simple ping command which returns the message latency of the bot

![image](https://user-images.githubusercontent.com/59373798/175754040-d333a3e0-9ac7-42f9-b5f8-1bb8e25f667f.png)

Finally, I wanted to try using the nasa api to get some space pictures, so i ended up making a command for that as well

This command takes an optional date argument in the form of YYYY-MM-DD

Without the date option, the command returns nasa's picture of the day (for today
With a date, it will fetch the picture of the day for that specific date

Example:

![image](https://user-images.githubusercontent.com/59373798/175754093-f28a1e0d-f794-418c-8b79-78d5dbfbabbe.png)

![image](https://user-images.githubusercontent.com/59373798/175754130-0e267322-e416-4bb1-97f0-041253cef06d.png)

Example 2:

![image](https://user-images.githubusercontent.com/59373798/175754114-fb441e06-9752-47b8-b069-8b5ccae65f06.png)

![image](https://user-images.githubusercontent.com/59373798/175754121-492dd37a-bf32-46d8-94f5-ca07542bc0ed.png)

# Using and configuring the bot

There are 2 things you need to do to able to use it:

Make a bot using discord's developer portal
There are a lot of resources on how to do that online, such as :

https://discordpy.readthedocs.io/en/stable/discord.html

Now, copy the token you will get to the config/config.json file in the BOT_TOKEN value

Next, generate a nasa api token here : https://api.nasa.gov/
and copy the token to the config/config.json file in the NASA_API_KEY value

Get the server id of the server in which you will be testing/using the bot by right-clicking the server icon and selecting copy id
Copy that id to the config/config.json file in the GUILD_ID value

Do the same thing for your bot, that is right click your bot profiles, and select copy id and copy that to the same file in the CLIENT_ID value

Finally create a google drive service account, which allows you to upload files to your google drive account directly
Watch the first 5 mins of this video to learn how to do it : https://www.youtube.com/watch?v=Z2MCxblgPoc&t=393s
Copy the contents of the file you will download to config/googleDriveCred.json and you are ready to go!

Just run "npm start" on the root directory to use the bot



