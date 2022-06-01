const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('시세')
        .setDescription('크리스탈 시세 확인'),
    async execute(interaction) {
        await interaction.deferReply();

        axios.get('http://152.70.248.4:5000/crystal/')
            .then(response => {
                if (response.data.Result == "Failed") {
                    const error_notify = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("알 수 없는 오류가 발생했습니다.")
                    interaction.editReply({ embeds: [error_notify], ephemeral: true });
                } else {
                    const crystal_result = new MessageEmbed()
                        .setColor('GOLD')
                        .setTitle('시세')
                        .addFields(
                            { name: "**▫️ 구매가**", value: "[🪙`" + String(response.data.Buy).replace(".0", "") + "`]", inline: false },
                            { name: "**▫️ 판매가**", value: "[🪙`" + String(response.data.Sell).replace(".0", "") + "`]", inline: false }
                        )
                        .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })
                    interaction.editReply({ embeds: [crystal_result] });
                }
            });
    }
};