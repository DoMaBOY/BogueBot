const Discord = require("discord.js");
const botconfig = require("../botconfig.json");
const ms = require("ms");

module.exports.run = async(bot, message, args) => {
    if (message.guild.member(message.author).hasPermission('MANAGE_ROLES')) {
        let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        let muterole = message.guild.roles.find(role => role.name === 'mutado');

        const mute_embed = new Discord.RichEmbed()
            .setTitle(`${bot.user.username} Mute`)
            .setFooter(`Chamado por ${message.author.username}`, message.author.displayAvatarURL);

        if (!tomute) return message.channel.send(mute_embed
            .addTitle(`${bot.user.username} Erro`)
            .addField("Usu�rio n�o encontrado",
                "Tente usar " + `${botconfig.prefix}tempmute` + " [@membro] [tempo]``"));

        // create a new role
        if (!muterole) {
            try {
                muterole = await message.guild.createRole({
                    name: "mutado",
                    color: "#000000",
                    permissions: []
                });

                message.guild.channels.forEach(async(channel, id) => {
                    await channel.overwritePermissions(muterole, {
                        SEND_MESSAGES: false
                    });
                });
            } catch (e) {
                console.log(e.stack);
            }
        }
        // new role made

        let mutetime = args[1];
        if (!mutetime) {
            mute_embed
                .setTitle(`${bot.user.username} Erro`)
                .setColor("#FF0000")
                .addField("Tempo n�o especificado", `Tente usar: ${botconfig.prefix}tempmute [@membro] [tempo](s/m/h)`)
                .addField("Exemplo", "``" + `${botconfig.prefix}tempmute [@membro] 10s` +
                    "``\nMuta o usu�rio por 10 segundos.");

            return message.channel.send(mute_embed);
        }
        await (tomute.addRole(muterole.id));

        message.channel.send(mute_embed
            .setTitle(`**${tomute.displayName}** foi mutado por ${ms(ms(mutetime))}`)
            .setColor("00FF00"));

        console.log(`${message.author.username} muted user [${tomute.displayName}] for ${ms(ms(mutetime))}.`);

        setTimeout(function() {

            if (!tomute.roles.find(role => role.name === 'mutado')) {
                return;
            } else {
                tomute.removeRole(muterole.id);
                message.channel.send(mute_embed
                    .setTitle(`**${tomute.displayName}** foi desmutado`)
                    .setColor("00FF00"));
                console.log(`Membro [${tomute.displayName}] foi desmutado.`);
            }
        }, ms(mutetime));
    } else {
        return message.channel.send(new Discord.RichEmbed()
            .setTitle("Voc� n�o tem permiss�o para usar esse comando.")
            .setColor("#FF0000")
            .setFooter(`Chamado por ${message.author.username}`, message.author.displayAvatarURL));
    }
}
module.exports.help = {
    name: "tempmute"
}