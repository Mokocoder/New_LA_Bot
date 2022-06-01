const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageSelectMenu, MessageButton, MessageEmbed } = require('discord.js');
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('거래소')
        .setDescription('거래소 시세 검색')
        .addStringOption(option =>
            option
                .setName('아이템')
                .setDescription('검색할 아이템을 입력하세요.')
                .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();

        itemnm = String(interaction.options.getString('아이템'))

        axios.get(encodeURI('http://152.70.248.4:5000/tradeplus/' + itemnm))
            .then(response => {
                if (response.data.Result == "Failed") {
                    const error_notify = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("알 수 없는 오류가 발생했습니다.")
                        .setDescription('아바타는 검색이 불가능합니다.')
                    interaction.editReply({ embeds: [error_notify], ephemeral: true });
                } else {
                    if (response.data.Data.length > 1) {
                        lists = ""

                        for (const i in response.data.Data) {
                            lists = lists + "` " + String(parseInt(i) + 1) + " ` " + response.data.Data[i] + "\n"
                        }

                        const tradelist_result = new MessageEmbed()
                            .setColor('GOLD')
                            .setTitle("아이템 목록")
                            .addFields(
                                { name: "▫️ 아이템 목록", value: lists, inline: true }
                            )
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                        const menus = [
                            {
                                label: '목록',
                                description: '검색된 아이템들의 목록',
                                value: 'first_option',
                                customId: 'select',
                                async action(interaction) {
                                    await interaction.update({ embeds: [tradelist_result] });
                                },
                            }
                        ]

                        const results = {};

                        for (const i in response.data.Data) {
                            menus.push(
                                {
                                    label: response.data.Data[i],
                                    value: response.data.Data[i],
                                    customId: 'select',
                                    async action(interaction) {
                                        await interaction.deferUpdate();

                                        if (results[this.value] === undefined) {
                                            axios.get(encodeURI('http://152.70.248.4:5000/tradeplus/' + this.value))
                                                .then(search_response => {
                                                    if (search_response.data.Result == "Failed") {
                                                        const error_notify = new MessageEmbed()
                                                            .setColor('RED')
                                                            .setTitle("알 수 없는 오류가 발생했습니다.")
                                                            .setDescription('아바타는 검색이 불가능합니다.')
                                                        interaction.editReply({ embeds: [error_notify], ephemeral: true });
                                                    } else {
                                                        const number = search_response.data.FirstItem[0].substr(search_response.data.FirstItem[0].lastIndexOf(":") + 2,);
                                                        const itemgrade = search_response.data.FirstItem[0].substr(0, search_response.data.FirstItem[0].indexOf(' '));
                                                        const percount = String(search_response.data.FirstItem[1]).replace("개 단위", "");

                                                        if (percount == "None") {
                                                            percount = "1"
                                                        }

                                                        axios.get("http://152.70.248.4:5000/trade/" + String(number))
                                                            .then(search_response2 => {
                                                                count = ""
                                                                price = ""

                                                                for (const i in search_response2.data.Pricechart) {
                                                                    priceraw = parseInt(String(search_response2.data.Pricechart[i].Amount).replace(",", ""))
                                                                    priceraw = priceraw / parseInt(percount)
                                                                    count = count + "` " + String(parseInt(i) + 1) + " ` " + String(priceraw).replace(".0", "") + "\n"
                                                                    price = price + "[🪙`" + String(search_response2.data.Pricechart[i].Price) + "`]" + "\n"
                                                                }

                                                                const trade_result = new MessageEmbed()
                                                                    .setColor('GOLD')
                                                                    .setTitle("거래소")
                                                                    .setDescription("**[" + itemgrade + "][" + search_response2.data.Name + "] " + percount + "개 단위**")
                                                                    .addFields(
                                                                        { name: "▫️ 묶음 수량", value: count, inline: true },
                                                                        { name: "▫️ 묶음 당 가격", value: price, inline: true }
                                                                    )
                                                                    .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                                                                interaction.editReply({ embeds: [trade_result] });

                                                                results[this.value] = trade_result;
                                                            });
                                                    }
                                                });
                                        } else {
                                            interaction.editReply({ embeds: [results[this.value]] });
                                        }
                                    },
                                }
                            )
                        }

                        const row = new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId('select')
                                .setPlaceholder('시세를 보고싶은 아이템을 선택하세요.')
                                .addOptions(menus),
                        );

                        interaction.editReply({ embeds: [tradelist_result], components: [row] });

                        const filter = i => {
                            btninfo = menus.filter(
                                (button) => button.customId === i.customId && (i.message.interaction.id === interaction.id)
                            );

                            if (btninfo.length > 0) {
                                return btninfo;
                            }
                        };

                        const collector = interaction.channel.createMessageComponentCollector({
                            filter,
                            time: 120 * 1000,
                        });

                        collector.on("collect", async (i) => {
                            const button = menus.find(
                                (button) => button.value === i.values[0]
                            );
                            if (i.user.id !== interaction.user.id) {
                                await i.reply({
                                    content: '타인의 선택지는 사용할 수 없습니다.',
                                    ephemeral: true
                                });
                            } else {
                                await button.action(i);
                            }
                        });
                    } else {
                        const number = response.data.FirstItem[0].substr(response.data.FirstItem[0].lastIndexOf(":") + 2,);
                        const itemgrade = response.data.FirstItem[0].substr(0, response.data.FirstItem[0].indexOf(' '));
                        const percount = String(response.data.FirstItem[1]).replace("개 단위", "");

                        if (percount == "None") {
                            percount = "1"
                        }

                        axios.get("http://152.70.248.4:5000/trade/" + String(number))
                            .then(response2 => {
                                count = ""
                                price = ""

                                for (const i in response2.data.Pricechart) {
                                    priceraw = parseInt(String(response2.data.Pricechart[i].Amount).replace(",", ""))
                                    priceraw = priceraw / parseInt(percount)
                                    count = count + "` " + String(parseInt(i) + 1) + " ` " + String(priceraw).replace(".0", "") + "\n"
                                    price = price + "[🪙`" + String(response2.data.Pricechart[i].Price) + "`]" + "\n"
                                }

                                const trade_result = new MessageEmbed()
                                    .setColor('GOLD')
                                    .setTitle("거래소")
                                    .setDescription("**[" + itemgrade + "][" + response2.data.Name + "] " + percount + "개 단위**")
                                    .addFields(
                                        { name: "▫️ 묶음 수량", value: count, inline: true },
                                        { name: "▫️ 묶음 당 가격", value: price, inline: true }
                                    )
                                    .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                                interaction.editReply({ embeds: [trade_result] });
                            })
                    }
                }
            });
    }
};