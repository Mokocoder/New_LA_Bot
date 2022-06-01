const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('사사게')
        .setDescription('사사게 확인')
        .addStringOption(option =>
            option
                .setName('닉네임')
                .setDescription('닉네임을 적으세요.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        nickname = String(interaction.options.getString('닉네임'))

        axios.get(encodeURI('http://152.70.248.4:5000/sasa/' + nickname))
            .then(response => {
                if (response.data.Result == "Failed") {
                    const error_notify = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("정보처리 과정 중 알 수 없는 오류가 발생했습니다.")
                        .setDescription('없는 캐릭터, 서버이용 불가 등')
                    interaction.editReply({ embeds: [error_notify], ephemeral: true });
                } else {
                    sasalist = ""

                    for (const i in response.data.SasaList) {
                        sasalist = sasalist + "▫️ " + response.data.SasaList[i] + "\n"
                        if (i == 4) {
                            sasalist = sasalist + "\n(게시물이 개수가 5개 이상입니다. 5개 까지만 표시)"
                        }
                    }

                    const sasa_result = new MessageEmbed()
                        .setColor('BLURPLE')
                        .setTitle("사사게 (" + nickname + ")")
                        .setDescription('상단 파란색 사사게 클릭시 이동')
                        .setURL(response.data.SasaUrl)
                        .addFields(
                            { name: "▫️ 사사게 검색 정보(최근 1만 게시글)", value: sasalist, inline: false }
                        )
                        .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })
                    interaction.editReply({ embeds: [sasa_result], ephemeral: true });
                }
            });
    }
};