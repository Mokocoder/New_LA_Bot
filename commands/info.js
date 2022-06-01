const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { default: axios } = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('정보')
        .setDescription('해당 닉네임 유저의 정보를 조회합니다.')
        .addStringOption(option =>
            option
                .setName('닉네임')
                .setDescription('닉네임을 적으세요.')
                .setRequired(true))
        .addBooleanOption(option =>
            option
                .setName('타인표시')
                .setDescription('타인에게 표시 여부(선택사항)')
                .setRequired(false)),
    async execute(interaction) {

        username = String(interaction.options.getString('닉네임'))

        ephbool = interaction.options.getBoolean('타인표시')

        if (ephbool === true) {
            ephbool = false;
        } else {
            ephbool = true;
        }

        await interaction.deferReply({ ephemeral: ephbool });

        axios.get(encodeURI('http://152.70.248.4:5000/userinfo/' + username))
            .then(response => {
                if (response.data.Result == "Failed") {
                    const error_notify = new MessageEmbed()
                        .setColor('RED')
                        .setTitle("알 수 없는 오류가 발생했습니다.")
                        .setDescription('(없는 캐릭터, 서버이용 불가 등)')
                    interaction.editReply({ embeds: [error_notify], ephemeral: ephbool });
                } else {
                    if (response.data.Result == "1레벨") {
                        const lvl1_notify = new MessageEmbed()
                            .setColor('DARK_GOLD')
                            .setTitle("해당 캐릭터는 레벨이 1 이하입니다.")
                        interaction.editReply({ embeds: [lvl1_notify], ephemeral: ephbool });
                    } else {
                        rkrdlsfinal = ""

                        for (const i in response.data.Basic.Engrave) {
                            eng = response.data.Basic.Engrave[i];
                            if (eng === "각인 없음") {
                                break;
                            } else {
                                num = (eng).indexOf(" Lv.")
                                lvl = (eng).substr(parseInt(num) + 5,)
                                eng = (eng).substr(0, num)
                                rkrdlsfinal = rkrdlsfinal + "` " + lvl + " ` : " + eng + "\n"
                            }
                        }

                        if (rkrdlsfinal === "") {
                            rkrdlsfinal = "`각인 없음`\n"
                        }

                        const main_result = new MessageEmbed()
                            .setColor('WHITE')
                            .setAuthor({ name: response.data.Basic.Name, iconURL: response.data.Basic.Class.Icon })
                            .addFields(
                                {
                                    name: "**▫️ 기본 정보**",
                                    value: (
                                        "`서ㅤ버` : " + response.data.Basic.Server + "\n" +
                                        "`클래스` : " + response.data.Basic.Class.Name + "\n" +
                                        "`길ㅤ드` : " + response.data.Basic.Guild + "\n" +
                                        "`칭ㅤ호` : " + response.data.Basic.Title + "\n\n" +
                                        "**▫️ 특성 정보**\n" +
                                        "`공격력` : " + response.data.Basic.Stat.Attack + "\n" +
                                        "`생명력` : " + response.data.Basic.Stat.Health + "\n\n" +
                                        "`치ㅤ명` : " + response.data.Basic.Stat.Critical + "\n" +
                                        "`특ㅤ화` : " + response.data.Basic.Stat.Specialty + "\n" +
                                        "`제ㅤ압` : " + response.data.Basic.Stat.Subdue + "\n" +
                                        "`신ㅤ속` : " + response.data.Basic.Stat.Agility + "\n" +
                                        "`인ㅤ내` : " + response.data.Basic.Stat.Endurance + "\n" +
                                        "`숙ㅤ련` : " + response.data.Basic.Stat.Proficiency
                                    ),
                                    inline: true
                                },
                                { name: String.fromCharCode(173), value: String.fromCharCode(173), inline: true },
                                {
                                    name: "**▫️ 레벨 정보**",
                                    value: (
                                        "`전ㅤ투` : " + response.data.Basic.Level.Battle + "\n" +
                                        "`원정대` : " + response.data.Basic.Level.Expedition + "\n" +
                                        "`아이템` : " + response.data.Basic.Level.Item + "\n" +
                                        "`영ㅤ지` : " + response.data.Basic.Wisdom.Level + " " + response.data.Basic.Wisdom.Name + "\n\n" +
                                        "**▫️ 각인 효과**\n" +
                                        rkrdlsfinal + "\n" +
                                        "**▫️ 성향 정보**\n" +
                                        "`지ㅤ성` : " + response.data.Basic.Tendency.Intellect + "\n" +
                                        "`담ㅤ력` : " + response.data.Basic.Tendency.Bravery + "\n" +
                                        "`매ㅤ력` : " + response.data.Basic.Tendency.Charm + "\n" +
                                        "`친ㅤ절` : " + response.data.Basic.Tendency.Kindness
                                    ),
                                    inline: true
                                },
                            )
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                        skilllen = 0
                        skillspace = 0
                        skillfinal = ""

                        if (response.data.Skill.Skill[0].Name === "스킬 없음") {
                            skillfinal = "`스킬 없음`"
                        } else {
                            for (const i in response.data.Skill.Skill) {
                                if (skilllen < (response.data.Skill.Skill[i].Name).length) {
                                    skilllen = (response.data.Skill.Skill[i].Name).length
                                }

                                if (skillspace < ((response.data.Skill.Skill[i].Name + " ").match(/\ /g)?.length - 1)) {
                                    skillspace = ((response.data.Skill.Skill[i].Name + " ").match(/\ /g)?.length - 1)
                                }
                            }

                            skilllen = skilllen + 1

                            for (const i in response.data.Skill.Skill) {
                                skfnname = response.data.Skill.Skill[i].Name

                                if (skillspace > 0) {
                                    while (skillspace - ((skfnname + " ").match(/\ /g)?.length - 1) > 0) {
                                        skfnname = skfnname + "\u0020"
                                    }
                                }
                                while (skfnname.length < skilllen) {
                                    skfnname = skfnname + "ㅤ"
                                }
                                skillfinal = skillfinal + "`" + (skfnname + "` Lv." + response.data.Skill.Skill[i].Level + " `" + response.data.Skill.Skill[i].Tri) + "`\n"
                            }

                            if (skillfinal === "") {
                                skillfinal = "`스킬 없음`"
                            }
                        }

                        const skill_result = new MessageEmbed()
                            .setColor('PURPLE')
                            .setTitle('스킬')
                            .addFields(
                                {
                                    name: "**▫️ " + "사용 스킬 포인트 " + response.data.Skill.SkillPoint.Used + " / 보유 스킬 포인트 " + response.data.Skill.SkillPoint.Total + "**",
                                    value: skillfinal
                                },
                            )
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                        jewlist = ""

                        for (const i in response.data.Jewl) {
                            if (response.data.Jewl[i].JewlName === "보석 없음") {
                                break;
                            } else {
                                if (response.data.Jewl[i].JewlName.indexOf('멸화') !== -1) {
                                    response.data.Jewl[i].JewlName = "<:aufghk:935346521312997477> `" + response.data.Jewl[i].JewlName + "`"
                                } else {
                                    if (response.data.Jewl[i].JewlName.indexOf('홍염') !== -1) {
                                        response.data.Jewl[i].JewlName = "<:ghddua:935346521912782878> `" + response.data.Jewl[i].JewlName + "`"
                                    } else {
                                        response.data.Jewl[i].JewlName = "`" + response.data.Jewl[i].JewlName + "`"
                                    }
                                }
                                jewlist = jewlist + (response.data.Jewl[i].JewlName + " | " + response.data.Jewl[i].SkillName + " | " + response.data.Jewl[i].Effect).replace("피해", "").replace("재사용 대기시간", "") + "\n"
                            }
                        }

                        if (jewlist === "") {
                            jewlist = ("`장착된 보석이 없습니다./보석 데이터를 불러오지 못 했습니다`")
                        }

                        cardlist = ""

                        if (response.data.Card[0].Name === "카드 없음") {
                            cardlist = "`카드 없음`"
                        } else {
                            for (const i in response.data.Card) {
                                cardlist = cardlist + ("`" + response.data.Card[i].Name + "` | " + response.data.Card[i].Effect) + "\n"
                            }
                        }

                        const jewl_card_result = new MessageEmbed()
                            .setColor('DARK_BLUE')
                            .setTitle('보석&카드')
                            .addFields(
                                { name: "▫️ 보석 목록", value: jewlist, inline: false },
                                { name: "▫️ 카드 목록", value: cardlist, inline: false },
                            )
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                        const ItemList = ["무기", "머리 방어구", "상의"];
                        const ItemList2 = ["하의", "장갑", "어깨 방어구"];

                        gearlist = ""
                        gearlist2 = ""

                        for (const i in ItemList) {
                            try {
                                eqname = response.data.Items[ItemList[i]].Name
                                tri = ""

                                if (response.data.Items[ItemList[i]].Tri !== "트라이포드 효과 적용 불가") {
                                    for (const j in response.data.Items[ItemList[i]].Tri) {
                                        tri = tri + "[`" + response.data.Items[ItemList[i]].Tri[j].SkillName + "`] " + response.data.Items[ItemList[i]].Tri[j].Effect + "\n"
                                    }
                                }
                                qualemoji = "⬜"
                                qual = parseInt(response.data.Items[ItemList[i]].Quality)

                                if (0 < qual && qual < 10) { qualemoji = "🟥" }
                                if (10 <= qual && qual < 30) { qualemoji = "🟨" }
                                if (30 <= qual && qual < 70) { qualemoji = "🟩" }
                                if (70 <= qual && qual < 90) { qualemoji = "🟦" }
                                if (90 <= qual && qual < 100) { qualemoji = "🟪" }
                                if (qual === 100) { qualemoji = "🟧" }

                                gearlist = gearlist + ("**" + qualemoji + " " + eqname + "** \n [`품질`] : " + response.data.Items[ItemList[i]].Quality + "\n" + tri) + "\n"
                            } catch (error) {
                            }
                        }

                        for (const i in ItemList2) {
                            try {
                                eqname = response.data.Items[ItemList2[i]].Name
                                tri = ""

                                if (response.data.Items[ItemList2[i]].Tri !== "트라이포드 효과 적용 불가") {
                                    for (const j in response.data.Items[ItemList2[i]].Tri) {
                                        tri = tri + "[`" + response.data.Items[ItemList2[i]].Tri[j].SkillName + "`] " + response.data.Items[ItemList2[i]].Tri[j].Effect + "\n"
                                    }
                                }
                                qualemoji = "⬜"
                                qual = parseInt(response.data.Items[ItemList2[i]].Quality)

                                if (0 < qual && qual < 10) { qualemoji = "🟥" }
                                if (10 <= qual && qual < 30) { qualemoji = "🟨" }
                                if (30 <= qual && qual < 70) { qualemoji = "🟩" }
                                if (70 <= qual && qual < 90) { qualemoji = "🟦" }
                                if (90 <= qual && qual < 100) { qualemoji = "🟪" }
                                if (qual === 100) { qualemoji = "🟧" }

                                gearlist2 = gearlist2 + ("**" + qualemoji + " " + eqname + "** \n [`품질`] : " + response.data.Items[ItemList2[i]].Quality + "\n" + tri) + "\n"
                            } catch (error) {
                            }
                        }

                        if (gearlist + gearlist2 === "") {
                            gearlist = ("`장착된 장비가 없습니다./장비 데이터를 불러오지 못 했습니다`")
                        }

                        const gearlist_result = new MessageEmbed()
                            .setColor('ORANGE')
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })
                            .setTitle('장비');

                        if (gearlist == "`장착된 장비가 없습니다./장비 데이터를 불러오지 못 했습니다`") {
                            if (gearlist2 == "") {
                                gearlist_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 장비 목록",
                                            value: gearlist,
                                            inline: true
                                        }
                                    )
                            } else {
                                gearlist_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 장비 목록",
                                            value: gearlist2,
                                            inline: true
                                        }
                                    )
                            }
                        } else {
                            if (gearlist2 === "") {
                                gearlist_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 장비 목록",
                                            value: gearlist,
                                            inline: true
                                        }
                                    )
                            } else {
                                gearlist_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 장비 목록",
                                            value: gearlist,
                                            inline: true
                                        },
                                        {
                                            name: String.fromCharCode(173),
                                            value: gearlist2,
                                            inline: true
                                        },
                                    )
                            }
                        }

                        const ItemList_2 = ["목걸이", "귀걸이1", "귀걸이2"];
                        const ItemList2_2 = ["반지1", "반지2"];

                        gearlist_2 = ""
                        gearlist2_2 = ""
                        gearlist3_2 = ""

                        for (const i in ItemList_2) {
                            try {
                                eqname = response.data.Items[ItemList_2[i]].Name
                                plus = ""
                                eng = ""
                                for (const j in response.data.Items[ItemList_2[i]].Plus) {
                                    plus = plus + response.data.Items[ItemList_2[i]].Plus[j] + "\n"
                                }
                                for (const j in response.data.Items[ItemList_2[i]].Engrave) {
                                    if (response.data.Items[ItemList_2[i]].Engrave[j].EngraveName !== "각인 효과 없음") {
                                        eng = eng + "[`" + response.data.Items[ItemList_2[i]].Engrave[j].EngraveName + "`] " + response.data.Items[ItemList_2[i]].Engrave[j].Effect + "\n"
                                    }
                                }

                                qualemoji = "⬜"
                                qual = parseInt(response.data.Items[ItemList_2[i]].Quality)

                                if (0 < qual && qual < 10) { qualemoji = "🟥" }
                                if (10 <= qual && qual < 30) { qualemoji = "🟨" }
                                if (30 <= qual && qual < 70) { qualemoji = "🟩" }
                                if (70 <= qual && qual < 90) { qualemoji = "🟦" }
                                if (90 <= qual && qual < 100) { qualemoji = "🟪" }
                                if (qual === 100) { qualemoji = "🟧" }

                                gearlist_2 = gearlist_2 + ("**" + qualemoji + " " + eqname + "** \n [`품질`] : " + response.data.Items[ItemList_2[i]].Quality + "\n" + plus + eng) + "\n"
                            } catch (error) {
                            }
                        }

                        for (const i in ItemList2_2) {
                            try {
                                eqname = response.data.Items[ItemList2_2[i]].Name
                                plus = ""
                                eng = ""
                                for (const j in response.data.Items[ItemList2_2[i]].Plus) {
                                    plus = plus + response.data.Items[ItemList2_2[i]].Plus[j] + "\n"
                                }
                                for (const j in response.data.Items[ItemList2_2[i]].Engrave) {
                                    if (response.data.Items[ItemList2_2[i]].Engrave[j].EngraveName !== "각인 효과 없음") {
                                        eng = eng + "[`" + response.data.Items[ItemList2_2[i]].Engrave[j].EngraveName + "`] " + response.data.Items[ItemList2_2[i]].Engrave[j].Effect + "\n"
                                    }
                                }

                                qualemoji = "⬜"
                                qual = parseInt(response.data.Items[ItemList2_2[i]].Quality)

                                if (0 < qual && qual < 10) { qualemoji = "🟥" }
                                if (10 <= qual && qual < 30) { qualemoji = "🟨" }
                                if (30 <= qual && qual < 70) { qualemoji = "🟩" }
                                if (70 <= qual && qual < 90) { qualemoji = "🟦" }
                                if (90 <= qual && qual < 100) { qualemoji = "🟪" }
                                if (qual === 100) { qualemoji = "🟧" }

                                gearlist2_2 = gearlist2_2 + ("**" + qualemoji + " " + eqname + "** \n [`품질`] : " + response.data.Items[ItemList2_2[i]].Quality + "\n" + plus + eng) + "\n"
                            } catch (error) {
                            }
                        }

                        try {
                            eqname = response.data.Items["어빌리티 스톤"].Name
                            addHP = "[`기본효과`] " + response.data.Items["어빌리티 스톤"].Basic + "\n"
                            if (response.data.Items["어빌리티 스톤"].Plus !== "없음") {
                                addHP = addHP + "[`추과효과`] " + response.data.Items["어빌리티 스톤"].Plus + "\n"
                            }
                            eng = ""
                            for (const i in response.data.Items["어빌리티 스톤"].Engrave) {
                                eng = eng + "[`" + response.data.Items["어빌리티 스톤"].Engrave[i].EngraveName + "`] " + response.data.Items["어빌리티 스톤"].Engrave[i].Effect + "\n"
                            }
                            gearlist2_2 = gearlist2_2 + ("**⬜ " + eqname + "**\n" + addHP + eng) + "\n"
                        } catch (error) {
                        }

                        try {
                            eqname = response.data.Items["팔찌"].Name
                            bracfn = ""
                            for (const i in response.data.Items["팔찌"].Plus) {
                                if (response.data.Items["팔찌"].Plus[i].includes("[잠김]")) {
                                    bracfn = bracfn + String(response.data.Items["팔찌"].Plus[i]).replace("[잠김]", "<:L:935790216365621308>") + "\n"
                                } else {
                                    if (response.data.Items["팔찌"].Plus[i].includes("[변경가능]")) {
                                        bracfn = bracfn + String(response.data.Items["팔찌"].Plus[i]).replace("[변경가능]", "<:C:935790216218804235>") + "\n"
                                    }
                                }
                            }
                            gearlist3_2 = ("**◻" + eqname + "**\n" + bracfn) + "\n"
                        } catch (error) {
                        }

                        if (gearlist + gearlist2 === "") {
                            gearlist = ("`장착된 악세서리가 없습니다./악세서리 데이터를 불러오지 못 했습니다`")
                        }

                        const gearlist2_result = new MessageEmbed()
                            .setColor('ORANGE')
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })
                            .setTitle('악세서리');

                        if (gearlist_2 === "`장착된 악세서리가 없습니다./악세서리 데이터를 불러오지 못 했습니다`") {
                            if (gearlist2_2 === "") {
                                gearlist2_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 악세서리 목록",
                                            value: gearlist_2,
                                            inline: true
                                        }
                                    )
                            } else {
                                gearlist2_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 악세서리 목록",
                                            value: gearlist2_2,
                                            inline: true
                                        }
                                    )
                            }
                        } else {
                            if (gearlist2_2 === "") {
                                gearlist2_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 악세서리 목록",
                                            value: gearlist_2,
                                            inline: true
                                        }
                                    )
                            } else {
                                gearlist2_result
                                    .addFields(
                                        {
                                            name: "▫️ 현재 장착중인 악세서리 목록",
                                            value: gearlist_2,
                                            inline: true
                                        },
                                        {
                                            name: String.fromCharCode(173),
                                            value: gearlist2_2,
                                            inline: true
                                        },
                                    )
                            }
                        }

                        if (gearlist3_2 !== "") {
                            gearlist2_result
                                .addFields(
                                    {
                                        name: String.fromCharCode(173),
                                        value: gearlist3_2,
                                        inline: false
                                    }
                                )
                        }

                        goldinterval = 0

                        for (const i in response.data.Gold.GoldList) {
                            if (("[`" + response.data.Gold.GoldList[i].Level + "`] [`" + response.data.Gold.GoldList[i].Class + "`] ").length > goldinterval) {
                                goldinterval = ("[`" + response.data.Gold.GoldList[i].Level + "`] [`" + response.data.Gold.GoldList[i].Class + "`] ").length
                            }
                        }

                        goldchn = 6

                        goldn = ""
                        onlygd = ""

                        if ((response.data.Gold.GoldList).length < goldchn) {
                            goldchn = (response.data.Gold.GoldList).length
                        }

                        goldinterval = goldinterval + 4

                        for (const i in response.data.Gold.GoldList) {
                            gold = response.data.Gold.GoldList[i].Gold
                            fnlr = "[`" + response.data.Gold.GoldList[i].Level + "`] [`" + response.data.Gold.GoldList[i].Class + "`] "
                            fnlr2 = "[`" + response.data.Gold.GoldList[i].Name + "`]"
                            fnlr = fnlr + "`"
                            while ((fnlr).length < goldinterval) {
                                fnlr = fnlr + "ㅤ"
                            }
                            goldn = goldn + (fnlr + "`" + fnlr2 + "\n")
                            onlygd = onlygd + "[🪙`" + gold + "`]\n"
                        }

                        const gold_result = new MessageEmbed()
                            .setColor('GOLD')
                            .setTitle('주급')
                            .setDescription("**총 [💰`" + String(response.data.Gold.TotalGold) + "`💰]**")
                            .addFields(
                                { name: "▫️ 주간 골드 획득 캐릭터", value: (goldn) + "\n\n▫️ 주간 컨텐츠 최저 레벨을 기준으로 계산했습니다.\n▫️ 클리어 골드 이외의 요소는 고려하지 않았습니다.\n▫️ 아브는 4관 까지만 계산했습니다.\n▫️ 도전 가능한 최상위 컨텐츠 기준으로 계산했습니다.", inline: true },
                                { name: "획득 골드", value: onlygd, inline: true },
                            )
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                        sasalist = ""

                        for (const i in response.data.Sasa.SasaList) {
                            sasalist = sasalist + "▫️ " + response.data.Sasa.SasaList[i] + "\n"
                            if (String(i) == "4") {
                                sasalist = sasalist + "\n(게시물이 개수가 5개 이상입니다. 5개 까지만 표시)"
                                break;
                            }
                        }

                        const sasa_result = new MessageEmbed()
                            .setColor('BLURPLE')
                            .setTitle("사사게 (" + username + ")")
                            .setURL(response.data.Sasa.SasaUrl)
                            .setDescription("상단 파란색 사사게 클릭시 이동")
                            .addFields(
                                { name: "▫️ 사사게 검색 정보(최근 1만 게시글)", value: sasalist },
                            )
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                        lisrrr = ""

                        for (const i in response.data.CharacterList) {
                            if (parseInt(response.data.CharacterList[i].Level.substr(response.data.CharacterList[i].Level.indexOf('Lv.') + 3, response.data.CharacterList[i].Level.lastIndexOf('.')).replace(',', '')) >= 1000) {
                                lisrrr = lisrrr + "[`" + response.data.CharacterList[i].Server + "`] [`" + response.data.CharacterList[i].Level + "`] [`" + response.data.CharacterList[i].Class + "`] [`" + response.data.CharacterList[i].Name + "`]\n"
                            }
                        }

                        if (lisrrr === "") {
                            lisrrr = "1,000레벨 이상 캐릭터 없음"
                        }

                        const charlist_result = new MessageEmbed()
                            .setColor('GREEN')
                            .setTitle("캐릭터 목록")
                            .addFields(
                                { name: "▫️ 1,000레벨 이상 캐릭터만 표기됩니다.", value: lisrrr },
                            )
                            .setFooter({ text: 'Made By 모코코더#3931', iconURL: 'https://cdn.discordapp.com/avatars/693421981705568346/f7cf118ca37e88b490ad1ac1489416ea.webp' })

                        const buttons = [
                            {
                                customId: "main_result",
                                label: "캐릭터 정보",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [main_result] });
                                },
                            },
                            {
                                customId: "skill_result",
                                label: "스킬",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [skill_result] });
                                },
                            },
                            {
                                customId: "jewl_card_result",
                                label: "보석&카드",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [jewl_card_result] });
                                },
                            },
                            {
                                customId: "gearlist_result",
                                label: "장비",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [gearlist_result] });
                                },
                            },
                            {
                                customId: "gearlist2_result",
                                label: "악세서리",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [gearlist2_result] });
                                },
                            },
                        ];

                        const buttons2 = [
                            {
                                customId: "gold_result",
                                label: "주급",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [gold_result] });
                                },
                            },
                            {
                                customId: "sasa_result",
                                label: "사사게",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [sasa_result] });
                                },
                            },
                            {
                                customId: "charlist_result",
                                label: "캐릭터 목록",
                                style: "SECONDARY",
                                async action(interaction) {
                                    await interaction.update({ embeds: [charlist_result] });
                                },
                            },
                        ];

                        const link_buttons = [
                            {
                                label: "문의",
                                style: "LINK",
                                url: "https://discord.gg/Bgsb7WkwVg",
                            },
                        ]

                        const row = new MessageActionRow().addComponents(
                            buttons.map((button) => {
                                return new MessageButton()
                                    .setCustomId(button.customId)
                                    .setLabel(button.label)
                                    .setStyle(button.style);
                            })
                        );

                        const row2 = new MessageActionRow().addComponents(
                            buttons2.map((button) => {
                                return new MessageButton()
                                    .setCustomId(button.customId)
                                    .setLabel(button.label)
                                    .setStyle(button.style);
                            }),
                            link_buttons.map((button2) => {
                                return new MessageButton()
                                    .setLabel(button2.label)
                                    .setStyle(button2.style)
                                    .setURL(button2.url);
                            })
                        );

                        interaction.editReply({ embeds: [main_result], components: [row, row2] });

                        fnbuttons = buttons.concat(buttons2);

                        const filter = i => {
                            btninfo = fnbuttons.filter(
                                (button) => button.customId === i.customId && (i.message.interaction.id === interaction.id)
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
                            const button = (fnbuttons).find(
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
                }
            });
    }
};