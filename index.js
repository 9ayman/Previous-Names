const config = require("./config.json");
const {
  Client,
  Embed,
  ActionRow,
  Button
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

  console.log(await db.get(`prevname_382936822860218370`))

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
      let pages = [];
      let page = "";
      let pageCounter = 0;

      let embed = new Embed();
      embed.color = config.color;
      embed.title = `Previous names of ${user.tag}`;

      if (!Array.isArray(usernames)) {
        embed.description = `${usernames.substring(0, usernames.indexOf("/"))} \`-\` <t:${usernames.substring(usernames.indexOf("/") + 1)}:f>\n`
        return message.reply({
          embeds: [embed]
        }).catch(err => {});
      }

      for (let i = 0; i < usernames.length; i++) {
        let username = usernames[i];
        let formattedName = `${username.substring(0, username.indexOf("/"))} \`-\` <t:${username.substring(username.indexOf("/") + 1)}:f>\n`;

        if (page.length + formattedName.length > 1024) {
          pages.push(page);
          page = "";
        }

        page += formattedName;
      }

      pages.push(page);

      let right = new Button()
      right.emoji = "➡️"
      right.customId = "right"
      right.style = 2
      right.disabled = usernames.length <= 10

      let left = new Button()
      left.emoji = "⬅️"
      left.customId = "left"
      left.style = 2
      left.disabled = true

      let buttons = new ActionRow(left, right)

      embed.fields.push({
        name: `Previous names of ${user.username}`,
        value: pages[pageCounter]
      });
      embed.timestamp = Date.now();
      embed.footer = {
        text: `Page ${pageCounter + 1}/${pages.length}`
      }

      let msg = await message.reply({
        embeds: [embed],
        components: [buttons]
      });

      let collector = msg.createComponentsCollector()

      collector.on("collected", async (i) => {

        templateEmbed.description = "`❌` Those buttons aren't for you.";
        if (i.user.id != message.author.id) return i.reply({
          embeds: [templateEmbed]
        }).catch(err => {});

        if (i.customId === "right") {
          pageCounter++;
          if (pageCounter >= pages.length - 1) {
            right.disabled = true;
            left.disabled = false;
          }
          else {
            left.disabled = false;
            right.disabled = false;
          }
        }
        else if (i.customId === "left") {
          pageCounter--;
          if (pageCounter == 0) {
            left.disabled = true;
            right.disabled = false;
          }
          else {
            right.disabled = false;
            left.disabled = false;
          }
        }

        let newButtons = new ActionRow(left, right)

        embed.footer = {
          text: `Page ${pageCounter + 1}/${pages.length}`
        }
        embed.timestamp = Date.now();
        embed.fields[0].value = pages[pageCounter];
        i.deferUpdate()
        await msg.edit({
          embeds: [embed],
          components: [newButtons],
        });

      })
    }
  }
});
