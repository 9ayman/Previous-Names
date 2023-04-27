const config = require("./config.json");
const {
  Client,
  Embed
} = require("devland.js");
const {
  QuickDB
} = require("quick.db");

const db = new QuickDB();
const client = new Client({
  intents: 3276799,
  connect: true,
  waitCacheBeforeReady: false,
  presence: {
    activities: [{
      name: "Tracking your nicknames",
      type: 1,
      url: 'https://twitch.tv/guard'
    }]
  },
  token: config.token
});

const templateEmbed = new Embed();
templateEmbed.color = config.color;

client.on("ready", async () => {
  console.log("Logged in as " + client.user.tag);
  console.log("Made by Hawk");
});

client.on("userUpdate", async (oldUser, newUser) => {
  if (oldUser.username != newUser.username) {
    db.push(`prevname_${oldUser.id}`, `${oldUser.username}/${Math.floor(Date.now() / 1000)}`);
    if (config.console) console.log("Saved username for " + newUser.id + " to " + oldUser.username);
  }
});

client.on("message", async (message) => {
  if (message.author.bot) return;
  let args = message.content.split(" ").slice(1).join(" ");
  if ((message.content.startsWith(`${config.prefix}prevnames`) || message.content.startsWith(`${config.prefix}prev`)) && !message.author.bot) {
    let user = message.memberMentions.first() || message.author || client.fetchUser(args);

    if (args && args === "clear") {
      if (config.canUsersClears == false) {
        templateEmbed.description = "`❌` This bot doesn't allow clearing old names.";
        return message.reply({
          embeds: [templateEmbed]
        }).catch(err => {
          console.log(err)
        });
      }
      let usernames = await db.get(`prevname_${message.author.id}`);
      if (!usernames) {
        templateEmbed.description = "`❌` You don't have any old name registered.";
        return message.reply({
          embeds: [templateEmbed]
        }).catch(err => {});
      }
      await db.delete(`prevname_${message.author.id}`);
      if (config.console) console.log(`Cleared ${usernames.length} old names for ${message.author.id}`);
      templateEmbed.description = `\`✅\` Cleared ${usernames.length} old names.`;
      return message.reply({
        embeds: [templateEmbed]
      }).catch(err => {})
    }
    else {
      let usernames = await db.get(`prevname_${user.id}`);
      if (!usernames) {
        templateEmbed.description = "`❌` No data not found for <@" + user.id + ">.";
        return message.reply({
          embeds: [templateEmbed]
        }).catch(err => console.log(err));
      }
      let embed = new Embed();
      embed.color = config.color;
      embed.fields.push({
        name: `Previous names of ${user.username}`,
        value: usernames.map(u => (u.substring(0, u.indexOf("/")) + " `-` <t:" + u.substring(u.indexOf("/") + 1) + ":f>\n")).join("")
      });
      message.reply({
        embeds: [embed]
      }).catch(err => console.log(err));
    }
  }
});