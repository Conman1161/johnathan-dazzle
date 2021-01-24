const discord = require("discord.js");
const attachment = new discord.MessageAttachment(
  "./images/error.png",
  "error.png"
);

// Return an embed with information on what the error is and how to fix it
function errorMessage(errorCode, messageObj) {
  var embed = new discord.MessageEmbed()
    .setTitle("**Oh no, you encountered an error!**")
    .attachFiles([attachment])
    .setThumbnail("attachment://error.png")
    .setColor("#FF0000")
    .setFooter(
      `For more help, message ${messageObj.channel.client.owners[0].tag} with your original message and error code (this message!)`
    );
  switch (errorCode) {
    // Improper !roll argument
    case 1:
      embed.addField(
        `Error code: ${errorCode}`,
        "You entered an improper argument for your roll. Make sure that you have everything formatted correctly"
      );
      break;

    // Improper !wild chart argument
    case 2:
      embed.addField(
        `Error code: ${errorCode}`,
        "You did not input a valid chart. Available charts can be seen by using `!help wild`"
      );
      break;

    // Improper !wild effect argument
    case 3:
      embed.addField(
        `Error code: ${errorCode}`,
        "You did not input a valid effect number for your given chart. Please make sure the effect is within range of your given chart"
      );
      break;

    // Improper !rollstat argument
    case 4:
      embed.addField(
        `Error code: ${errorCode}`,
        "You did not use a valid argument. Available arguments can be seen by using `!help `"
      );
      break;
    // Improper !rollstats argument
    case 5:
      embed.addField(
        `Error code: ${errorCode}`,
        "You did not use a valid argument. Available arguments can be seen by using `!help rollstats`"
      );
      break;

    // Improper !trinket chart
    case 6:
      embed.addField(
        `Error code: ${errorCode}`,
        "You did not input a valid chart number. Check `!help trinket` to see how many charts are available."
      );
      break;

    // Empty !trinket result
    case 7:
      embed.addField(
        `Error code: ${errorCode}`,
        `The trinket you have rolled for does not exist. Please message **${message.client.owners[0].tag}** with this roll`
      );
      embed.setFooter(
        `Message ${messageObj.channel.client.owners[0].tag} and he will add them soon.`
      );
      break;

    // Empty !wild result
    case 8:
      embed.addField(
        `Error code: ${errorCode}`,
        `The effect you rolled on this chart currently does not exist internally. Message ${message.client.owners[0].tag} and he will add them soon.`
      );
      break;

    // RangeError (more than 1024 characters in embed field)
    case 9:
      embed.addField(
        `Error code: ${errorCode}`,
        "A field cannot have more than 1024 characters. Please try again with less characters"
      );
      break;
    // Rolladv improper argument (2d6, 5d20, etc.)
    case 10:
      embed.addField(
        `Error code: ${errorCode}`,
        "You entered an improper expression for your advantage. Please make sure you aren't passing in multiple dice"
      );
      break;

    // Improper die argument
    case 11:
      embed.addField(
        `Error code: ${errorCode}`,
        "You did not enter a proper die argument! Please double check your roll."
      );
      break;

    // No command or group found for help
    case 12:
      embed.addField(
        `Error code: ${errorCode}`,
        "You did not give a recognized command or group! Please double check the command or group name."
      );
      break;

    // No permission to view (!help)
    case 13:
      embed.addField(
        `Error code: ${errorCode}`,
        `You do not have the permissions to view the information about this command. If you think this is a mistake, contact a server admin.`
      );
      break;

    // No dice provided for average
    case 14:
      embed.addField(
        `Error code: ${errorCode}`,
        `You did not give any dice to take the average of. Please make sure you enter your dice.`
      );
      break;

    // Improper argument for average
    case 15:
      embed.addField(
        `Error code: ${errorCode}`,
        `You entered a non-supported argument for your average. If you think this is a mistake, please contact ${messageObj.channel.client.owners[0].tag}`
      );
      break;

    // No dice provided for min
    case 16:
      embed.addField(
        `Error code: ${errorCode}`,
        `You did not give any dice to take the minimum of. Please make sure you enter your dice.`
      );
      break;

    // Improper argument for min
    case 17:
      embed.addField(
        `Error code: ${errorCode}`,
        `You entered a non-supported argument for your minimum. If you think this is a mistake, please contact ${messageObj.channel.client.owners[0].tag}`
      );
      break;

    // No dice provided for min
    case 18:
      embed.addField(
        `Error code: ${errorCode}`,
        `You did not give any dice to take the maximum of. Please make sure you enter your dice.`
      );
      break;

    // Improper argument for min
    case 19:
      embed.addField(
        `Error code: ${errorCode}`,
        `You entered a non-supported argument for your maximum. If you think this is a mistake, please contact ${messageObj.channel.client.owners[0].tag}`
      );
      break;

    // Possible result too large (!roll)
    case 20:
      embed.addField(
        `Error code: ${errorCode}`,
        `Due to memory constraints, the most dice you can roll in one expression (**X**d**Y**+**Z**) is \`1,000,000\`. If you need this die to be roll, message **${messageObj.channel.client.owners[0].tag}**`
      );
      break;

    // Unrecognized encounter argument
    case 21:
      embed.addField(
        `Error code: ${errorCode}`,
        `You did not enter a recognized encounter type. Please use \`!help encounter\` to check what types of encounters are supported`
      );
      break;

    // Unkown DoMT arg
    case 22:
      embed.addField(
        `Error code: ${errorCode}`,
        `You did not use a recognized argument for the Deck of Many Things. Make sure you've entered your information correctly`
      );
      break;

    // Currently undocumented/unknown error
    default:
      embed.addField(
        "Error code: 0",
        `This is an undocumented error. Please message **${messageObj.channel.client.owners[0].tag}** with this message and your original command ASAP!`
      );
      embed.addField("Your message:", `\`${messageObj.content}\``);
      embed.addField("Error message: ", `\`${errorCode}\``);
      break;
  }
  return embed;
}
module.exports = { errorMessage };
