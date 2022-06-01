const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('모험섬')
        .setDescription('모험섬 확인'),
    async execute(interaction) {
        await interaction.deferReply();

        axios.get('http://152.70.248.4:5000/adventureisland/')
            .then(response => {
                if (response.data.Result == "Failed") {
                    const error_notify = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("알 수 없는 오류가 발생했습니다. | 잠시 후 다시 시도해주세요.")
                    interaction.editReply({ embeds: [error_notify], ephemeral: true });
                } else {
                    advenisland = ""

                    for (const i in response.data.Island) {
                        advenisland = advenisland + response.data.Island[i].Name + " [" + response.data.Island[i].Reward + "]\n"
                    }

                    const adv_result = new MessageEmbed()
                        .setColor('GOLD')
                        .setTitle('오늘의 모험섬')
                        .addFields(
                            { name: "▫️ " + response.data.IslandDate, value: advenisland, inline: false }
                        )
                        .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })
                    interaction.editReply({ embeds: [adv_result] });
                }
            });
    }
};