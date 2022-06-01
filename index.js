const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, MessageEmbed } = require('discord.js');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const dotenv = require('dotenv');
dotenv.config();
const TOKEN = process.env['TOKEN'];
const TEST_GUILD_ID = process.env['TEST_GUILD_ID'];

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log('준비 완료');
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: '9'
    }).setToken(TOKEN);
    (async () => {
        try {
            if (!TEST_GUILD_ID) {
                await rest.put(
                    Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                },
                );
                console.log('명령어 전역 등록 완료');
            } else {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, TEST_GUILD_ID), {
                    body: commands
                },
                );
                console.log('명령어 길드 등록 완료');
            }
        } catch (error) {
            if (error) console.error(error);
        }
    })();
});

client.on('interactionCreate', async interaction => {    
    // if (interaction.isButton()) {        
    //     console.log(interaction.message.id);
    // }

    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    if (interaction.guildId == null) {
        const DM_blocked_notify = new MessageEmbed()
            .setColor('RED')
            .setTitle("DM은 금지되었습니다.")

        await interaction.reply({ embeds: [DM_blocked_notify], ephemeral: true });
        return;
    }
    try {
        await command.execute(interaction);
    } catch (error) {
        if (error) console.error(error);

        const error_notify = new MessageEmbed()
            .setColor('RED')
            .setTitle("알 수 없는 오류가 발생했습니다.")

        try {
            await interaction.reply({ embeds: [error_notify], ephemeral: true });
        } catch (error) {
            await interaction.editReply({ embeds: [error_notify], ephemeral: true });
        }
    }
});

client.login(TOKEN);