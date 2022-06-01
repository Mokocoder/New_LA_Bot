const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('입찰')
        .setDescription('경매 입찰 가격 최적화')
        .addIntegerOption(option =>
            option
                .setName('가격')
                .setDescription('아이템 가격을 적으세요.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        const price = (interaction.options.getInteger('가격'))

        const sale_result = new MessageEmbed()
            .setColor('GOLD')
            .setTitle('💰 경매 입찰 최적가(판매시)')
            .setDescription("[🪙`" + String(price) + "`]")
            .addFields(
                { name: "▫️ 손익분기점", value: ("4인 : [🪙`" + String(parseInt(price * 0.95 * 3 / 4)) + "`]\n8인 : [🪙`" + String(parseInt(price * 0.95 * 7 / 8)) + "`]"), inline: false },
                { name: "▫️ 입찰적정가", value: ("4인 : [🪙`" + String(parseInt(price * 0.95 * 3 / 4 * 100 / 110)) + "`] 🔻\n8인 : [🪙`" + String(parseInt(price * 0.95 * 7 / 8 * 100 / 110)) + "`] 🔻"), inline: false },
            )
            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })
        interaction.editReply({ embeds: [sale_result] });
    }
};