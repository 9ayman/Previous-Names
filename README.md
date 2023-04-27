# Discord Prev Names Bot

This is a simple Discord bot that tracks the previous usernames of users in your server. Whenever a user changes their nickname, the bot will automatically save their previous nickname along with the timestamp of the change. You can then use a command to retrieve the list of previous nicknames for a particular user.

## Features

- Tracks the previous usernames of users in a Discord server
- Saves the old usernames in a database (QuickDB)
- Displays the old usernames in a paginated embed when requested by a user
- Provides a button interface to navigate between pages of old usernames
- Can clear old usernames for a user
- Configurable with a JSON file (config.json)
- Built using Node.js and the devland.js and QuickDB libraries

## Installation

1. Clone or download this repository.
2. Install Node.js (if not already installed) from https://nodejs.org/en/
3. Open a terminal or command prompt and navigate to the downloaded repository.
4. Run `npm install` to install the required dependencies.
5. Rename `config.example.json` to `config.json`.
6. Open `config.json` and replace the `token` field with your Discord bot token. You can obtain a bot token from the Discord Developer Portal (https://discord.com/developers/applications).
7. (Optional) Modify the other fields in `config.json` as desired. You can change the bot prefix, the color of the embeds, and whether or not users are allowed to clear their previous nicknames.
8. Run `npm start` to start the bot.

## Usage

### The bot responds to the following command:
;prev <@user> - Replace `<@user>` with the user whose previous nicknames you want to view or leave it blank. If the user has changed their nickname in the past, the bot will respond with an embed showing their previous nicknames and the dates they were changed.

### To clear your own previous nicknames, use the following command:
;prev clear - If the bot is configured to allow users to clear their previous nicknames, this will delete all previously saved nicknames for the user.

## Contributing

If you find a bug or would like to suggest a new feature, feel free to open an issue or submit a pull request.

## Support

If you have any questions or issues, please don't hesitate to contact us. We offer the following support options:

- **Discord Server:** For fast support, we recommend joining our Discord server at https://discord.gg/USYde8THV6. Our team is active on Discord and can provide quick assistance with any problems you may encounter.

- **GitHub Issues:** If you encounter any bugs or issues with our project, please feel free to create a new issue on our GitHub repository. Our development team will investigate the issue and provide a fix as soon as possible.

Thanks for reading 💖.
