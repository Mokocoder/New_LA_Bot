const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('공략')
        .setDescription('공략 확인'),
    async execute(interaction) {
        await interaction.deferReply();
        const buttons = [
            {
                customId: "Bal",
                label: "발탄",
                style: "SECONDARY",
                async action(interaction) {
                    await interaction.update("https://media.discordapp.net/attachments/935529009251487810/946768903583973426/i13704437401.jpeg");
                },
            },
            {
                customId: "Bia",
                label: "비아",
                style: "SECONDARY",
                async action(interaction) {
                    await interaction.update("https://cdn.discordapp.com/attachments/935529009251487810/946774184451801088/i14057139075.jpeg");
                },
            },
            {
                customId: "Cu",
                label: "쿠크",
                style: "SECONDARY",
                async action(interaction) {
                    await interaction.update("https://cdn.discordapp.com/attachments/935529009251487810/946775136462311554/i15518900640.jpg");
                },
            }
        ];

        const row = new MessageActionRow().addComponents(
            buttons.map((button) => {
                return new MessageButton()
                    .setCustomId(button.customId)
                    .setLabel(button.label)
                    .setStyle(button.style);
            })
        );

        await interaction.editReply({ content: "https://media.discordapp.net/attachments/935529009251487810/946768903583973426/i13704437401.jpeg", components: [row] });

        const filter = i => {
            btninfo = buttons.filter(
                (button) => (button.customId === i.customId) && (i.message.interaction.id === interaction.id)
            );            

            if (btninfo.length > 0) {
                return btninfo;
            }
        };

        const collector = interaction.channel.createMessageComponentCollector({
            filter,
            time: 60 * 1000,
        });

        collector.on("collect", async (i) => {
            const button = buttons.find(
                (button) => button.customId === i.customId
            );

            if (i.user.id !== interaction.user.id) {
                await i.reply({
                    content: '타인의 버튼은 사용할 수 없습니다.',
                    ephemeral: true
                });
            } else {                
                await button.action(i);
            }
        });
    }
};