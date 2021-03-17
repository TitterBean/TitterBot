/*
  Ethan's first bot (:
  
*/

require("dotenv").config(); // Do not edit this line

// Username (optional)
const USERNAME = "TitterBean-";

// Twitch Client Key (optional TWITCH_KEY)
const CLIENT_ID = process.env.live_410771733_UaH7CoOQlJJB8fLRC270iVjcM3qoaB;

// Your Discord server ID
const SERVER_ID = "741831539263930431";

// The ID of the channel INSIDE of your Discord server that you want welcome messages sent to (optional)
const CHANNEL_ID = "741831539893207052";

// Welcome message sent in the channel that was assigned above (optional)
// $MEMBER automatically pings the user, example: @eli#1000
const WELCOME_MSG =
  ":tada: Fuck you $MEMBER :tada:";

// The ID of the role automatically assigned to a user when they join your server (optional)
const ROLE_ID = "";

/*
 *  Discord Client Status (optional)
 *  Types: WATCHING ($MEMBER_COUNT users)| PLAYING | LISTENING | STREAMING
 *
 *  *If you have TYPE set to STREAMING you MUST also set a stream link*
 */
const DISCORD_STATUS_TYPE = "STREAMING";
const DISCORD_STATUS_MESSAGE = "Mo To";
const DISCORD_STATUS_LINK = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

/*
 *  DO NOT EDIT ANY OF THE CODE BELOW
 *
 *  Unless you know what you are doing (:
 */

const Discord = require("discord.js");
const fetch = require("node-fetch");
const color = require("chalk");
const bot = new Discord.Client();

bot.on("ready", () => {
  if (!SERVER_ID) {
    console.log(color.red("[Error] Please set a SERVER_ID in bot.js"));
    process.exit(1);
  }

  console.log(color.cyan("~~~~~~~~~~~~~~~~~~~"));
  console.log(color.cyan("Bot: ") + color.white(bot.user.tag));
  console.log(
    color.cyan("Twitch Extension: ") +
      (USERNAME && CLIENT_ID ? color.green("Active") : color.red("Inactive"))
  );
  console.log(
    color.cyan("Welcome MSG: ") +
      (WELCOME_MSG && CHANNEL_ID
        ? color.green("Active")
        : color.red("Inactive"))
  );
  console.log(
    color.cyan("Client Status: ") +
      (DISCORD_STATUS_TYPE && DISCORD_STATUS_MESSAGE
        ? color.green("Active")
        : color.red("Inactive"))
  );
  console.log(color.cyan("~~~~~~~~~~~~~~~~~~~"));
  refreshStatus();
});
bot.on('message', message => {
	if (!message.content.startsWith('!') || message.author.bot) return;

	const args = message.content.slice('!'.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'lily') {
		for (q = 0; q < 100000; q++)
			message.channel.send('Bitch');
			
	} else if (command === 'miles') {
		for (q = 0; q < 100000; q++)
			message.channel.send('Loves cousin like geometry dash');
			
	} else if (command === 'ping') {
		message.channel.send('Pong');
	} else if (command === 'meme') {
		message.channel.send('Not for long');
	}
	// other commands...
});
bot.on("guildMemberAdd", guildMember => {
  refreshStatus();
  WELCOME_MSG
    ? bot.guilds
        .get(SERVER_ID)
        .channels.get(CHANNEL_ID)
        .send(WELCOME_MSG.replace("$MEMBER", `<@${guildMember.user.id}>`))
    : null;
  ROLE_ID
    ? guildMember.addRole(bot.guilds.get(SERVER_ID).roles.get(ROLE_ID))
    : null;
});

refreshStatus = async () => {
  let status = USERNAME && CLIENT_ID ? await fetchStatus() : { live: false };
  if (status.live) {
    bot.user.setActivity(status.title, {
      type: "STREAMING",
      url: "https://twitch.tv/" + USERNAME
    });
  } else {
    if (DISCORD_STATUS_TYPE != "STREAMING") {
      bot.user.setActivity(
        DISCORD_STATUS_MESSAGE.replace(
          "$MEMBER_COUNT",
          bot.guilds.get(SERVER_ID).memberCount
        ),
        {
          type: DISCORD_STATUS_TYPE
        }
      );
    } else {
      bot.user.setActivity(
        DISCORD_STATUS_MESSAGE.replace(
          "$MEMBER_COUNT",
          bot.guilds.get(SERVER_ID).memberCount
        ),
        {
          type: "STREAMING",
          url: DISCORD_STATUS_LINK
        }
      );
    }
  }
};

fetchStatus = () => {
  return new Promise(async (resolve, reject) => {
    const user_id = await fetchUserId(USERNAME);
    fetch(`https://api.twitch.tv/kraken/streams/?channel=${user_id}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.twitchtv.v5+json",
        "Client-Id": CLIENT_ID
      }
    })
      .then(res => res.json())
      .then(json => {
        if (json._total > 0) {
          resolve({ live: true, title: json.streams[0].channel.status });
        } else {
          resolve({ live: false, title: null });
        }
      });
  });
};

fetchUserId = username => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.twitch.tv/kraken/users?login=${username}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.twitchtv.v5+json",
        "Client-Id": CLIENT_ID
      }
    })
      .then(res => res.json())
      .then(json => {
        resolve(json.users[0]._id);
      });
  });
};

setInterval(refreshStatus, 15 * 1000);

bot.login(process.env.DISCORD_KEY);

