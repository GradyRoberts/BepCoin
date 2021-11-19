/*
 * Register commands with Discord. Only needs to be ran once unless commands change
 */

const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { botId, guildId, token } = require('../../config.json');

const commands = [];
const commandsFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));

// Read commands dynamically
for (const file of commandsFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(botId, guildId), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);