const { MessageEmbed, MessageAttachment } = require("discord.js");
const fs = require("fs");
const stats = require("./statsModule");
const sheetsPath = `${process.cwd()}/commands/characters/sheets`;

const checks = [
   "acrobatics",
   "animal handling",
   "arcana",
   "athletics",
   "deception",
   "history",
   "insight",
   "intimidation",
   "investigation",
   "medicine",
   "nature",
   "perception",
   "performance",
   "persuasion",
   "religion",
   "sleight of hand",
   "stealth",
   "survival",
];
const saves = [
   "strength",
   "dexterity",
   "constitution",
   "intelligence",
   "wisdom",
   "charisma",
];

function getSheetEmbed(sheet) {
   var returnEmbed = new MessageEmbed()
      .setTitle(sheet.Name)
      .addField("Race:", sheet.Race, true)
      .addField("Class: ", sheet.Class, true)
      .addField("Level: ", sheet.Level, true)
      .addField(
         "Strength: ",
         `__**${stats.getMod(sheet.Strength)}**__ (${sheet.Strength})`,
         true
      )
      .addField(
         "Dexterity: ",
         `__**${stats.getMod(sheet.Dexterity)}**__ (${sheet.Dexterity})`,
         true
      )
      .addField(
         "Intelligence: ",
         `__**${stats.getMod(sheet.Intelligence)}**__ (${sheet.Intelligence})`,
         true
      )
      .addField(
         "Constitution: ",
         `__**${stats.getMod(sheet.Constitution)}**__ (${sheet.Constitution})`,
         true
      )
      .addField(
         "Wisdom: ",
         `__**${stats.getMod(sheet.Wisdom)}**__ (${sheet.Wisdom})`,
         true
      )
      .addField(
         "Charisma: ",
         `__**${stats.getMod(sheet.Charisma)}**__ (${sheet.Charisma})`,
         true
      )
      .attachFiles([
         new MessageAttachment(
            `${sheetsPath}/${sheet.owner}/${sheet.name.toLowerCase()}/icon.png`,
            "icon.png"
         ),
      ])
      .setThumbnail("attachment://icon.png")
      .setColor(sheet.embedColor.toUpperCase());

   var throwString = "";
   var savesString = "";
   for (let i = 0; i < Object.keys(sheet.Saves).length; i++) {
      let keys = Object.keys(sheet.Saves);
      throwString += `${sheet.Saves[keys[i]] == true
         ? `${keys[i]} (${getSaveBonus(keys[i], sheet) > 0
            ? "+"
            : `${getSaveBonus(keys[i], sheet) < 0 ? "-" : ""}`
         }${getSaveBonus(keys[i], sheet)})\n`
         : ""
         }`;
   }

   for (let i = 0; i < Object.keys(sheet.Skills).length; i++) {
      let keys = Object.keys(sheet.Skills);
      savesString += `${sheet.Skills[keys[i]] == true
         ? `${keys[i]} (${getCheckBonus(getCheckType(keys[i]), keys[i], sheet) > 0
            ? "+"
            : `${getCheckBonus(getCheckType(keys[i]), keys[i], sheet) < 0
               ? "-"
               : ""
            }`
         }${getCheckBonus(getCheckType(keys[i]), keys[i], sheet)})\n`
         : ""
         }`;
   }
   returnEmbed.addField(
      `Saving Throw Proficiencies`,
      throwString.length == 0
         ? "None! Use !edit to add proficiencies"
         : throwString,
      true
   );
   returnEmbed.addField(
      `Skill Check Proficiencies`,
      savesString.length == 0
         ? "None! Use !edit to add proficiencies"
         : savesString,
      true
   );

   return returnEmbed;
}

function getDefault(sheetDir) {
   var currentDir = fs.readdirSync(sheetDir, (err) => {
      throw err;
   });
   for (var i = 0; i < currentDir.length; i++) {
      var currentSheet = require(`${sheetDir}/${currentDir[i]}/sheet.json`);
      if (currentSheet.default) {
         return currentSheet;
      }
   }
   throw "No default character!";
}

function setDefault(newDefault, sheetDir) {
   var currentDir = fs.readdirSync(sheetDir, (err) => {
      throw err;
   });
   for (var i = 0; i < currentDir.length; i++) {
      var currentSheet = require(`${sheetDir}/${currentDir[i]}/sheet.json`);
      if (currentSheet.Name.toLowerCase() != newDefault.Name.toLowerCase()) {
         currentSheet.default = false;
         fs.writeFileSync(
            `${sheetDir}/${currentDir[i]}/sheet.json`,
            JSON.stringify(currentSheet, null, "\t"),
            (err) => {
               throw err;
            }
         );
      } else {
         currentSheet.default = true;
         fs.writeFileSync(
            `${sheetDir}/${currentDir[i]}/sheet.json`,
            JSON.stringify(currentSheet, null, "\t"),
            (err) => {
               throw err;
            }
         );
      }
   }
}

function getCheckType(check) {
   let strChecks = ["athletics"];
   let dexChecks = ["acrobatics", "sleight of hand", "stealth"];
   let intChecks = ["arcana", "history", "investigation", "nature", "religion"];
   let wisChecks = [
      "animal handling",
      "insight",
      "medicine",
      "perception",
      "survival",
   ];
   let chaChecks = ["deception", "intimidation", "performance", "persuasion"];

   if (strChecks.includes(check.toLowerCase())) {
      return "STR";
   } else if (dexChecks.includes(check.toLowerCase())) {
      return "DEX";
   } else if (intChecks.includes(check.toLowerCase())) {
      return "INT";
   } else if (wisChecks.includes(check.toLowerCase())) {
      return "WIS";
   } else if (chaChecks.includes(check.toLowerCase())) {
      return "CHA";
   }
   return null;
}

function getProfBonus(sheet) {
   let level = sheet.Level;
   if (level >= 17) {
      return 6;
   }
   if (level >= 13) {
      return 5;
   }
   if (level >= 9) {
      return 4;
   }
   if (level >= 5) {
      return 3;
   }
   return 2;
}

function getCheckBonus(checkType, check, sheet) {
   let index = checks.indexOf(check.toLowerCase());
   let values = Object.values(sheet.Skills);
   switch (checkType) {
      case "STR":
         return (
            parseInt(stats.getMod(sheet.Strength)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "DEX":
         return (
            parseInt(stats.getMod(sheet.Dexterity)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "INT":
         return (
            parseInt(stats.getMod(sheet.Intelligence)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "WIS":
         return (
            parseInt(stats.getMod(sheet.Wisdom)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "CHA":
         return (
            parseInt(stats.getMod(sheet.Charisma)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
   }
}

function getSaveBonus(saveType, sheet) {
   let index = saves.indexOf(saveType.toLowerCase());
   let values = Object.values(sheet.throws);
   switch (saveType.toLowerCase()) {
      case "str":
      case "strength":
         return (
            parseInt(stats.getMod(sheet.Strength)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "dex":
      case "dexterity":
         return (
            parseInt(stats.getMod(sheet.Dexterity)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "con":
      case "constitution":
         return (
            parseInt(stats.getMod(sheet.Constitution)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "int":
      case "intelligence":
         return (
            parseInt(stats.getMod(sheet.Intelligence)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "wis":
      case "wisdom":
         return (
            parseInt(stats.getMod(sheet.Wisdom)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
      case "cha":
      case "charisma":
         return (
            parseInt(stats.getMod(sheet.Charisma)) +
            (values[index] ? getProfBonus(sheet) : 0)
         );
   }
}

function setClassFeatures(sheet) {
   sheet.ClassFeatures = [];
   for (let i = 0; i < sheet.Classes.length; i++) {
      let currentClass = sheet.Classes[i];
      switch (currentClass.name.toLowerCase()) {
         case "artificer":
            // saving throws
            sheet.Saves.Constitution = i == 0 ? true : false;
            sheet.Saves.Intelligence = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push(
               "Light Armor",
               "Medium Armor",
               "Shields"
            );
            sheet.Proficiencies.Weapons.push(
               "Simple Weapons",
               "Firearms (Optional Rule)"
            );
            sheet.Proficiencies.Tools.push("Thieves' Tools", "Tinker's Tools");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Artificer", Feature: "Magical Tinkering" },
                  { Source: "Artificer", Feature: "Spellcasting (Ritual)" }
               );
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Infuse Item",
               });
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "The Right Tool for the Job",
               });
            }
            if (currentClass.level >= 6) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Tool Expertise",
               });
            }
            if (currentClass.level >= 7) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Flash of Genius",
               });
            }
            if (currentClass.level >= 10) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Magic Item Adept",
               });
            }
            if (currentClass.level >= 11) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Spell-Storing Item",
               });
            }
            if (currentClass.level >= 14) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Magic Item Savant",
               });
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Magic Item Master",
               });
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({
                  Source: "Artificer",
                  Feature: "Soul of Artifice",
               });
            }
            break;
         case "barbarian":
            // saving throws
            sheet.Saves.Strength = i == 0 ? true : false;
            sheet.Saves.Constitution = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push(
               "Light Armor",
               "Medium Armor",
               "Shields"
            );
            sheet.Proficiencies.Weapons.push("Simple Weapons", "Martial Weapons");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Barbarian", Feature: "Rage (2)" },
                  { Source: "Barbarian", Feature: "Unarmored Defense" }
               );
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push(
                  { Source: "Barbarian", Feature: "Reckless Attack" },
                  { Source: "Barbarian", Feature: "Danger Sense" }
               );
            }
            if (currentClass.level >= 3) {
               let rageIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Rage (2)";
               });
               sheet.ClassFeatures[rageIndex] = {
                  Source: "Barbarian",
                  Feature: "Rage (3)",
               };
            }
            if (currentClass.level >= 5) {
               sheet.ClassFeatures.push(
                  { Source: "Barbarian", Feature: "Extra Attack" },
                  { Source: "Barbarian", Feature: "Fast Movement" }
               );
               sheet.Speed += 10;
            }
            if (currentClass.level >= 6) {
               let rageIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Rage (3)";
               });
               sheet.ClassFeatures[rageIndex] = {
                  Source: "Barbarian",
                  Feature: "Rage (4)",
               };
            }
            if (currentClass.level >= 7) {
               sheet.ClassFeatures.push({
                  Source: "Barbarian",
                  Feature: "Feral Instinct",
               });
            }
            if (currentClass.level >= 9) {
               sheet.ClassFeatures.push({
                  Source: "Barbarian",
                  Feature: "Brutal Critical",
               });
            }
            if (currentClass.level >= 11) {
               sheet.ClassFeatures.push({
                  Source: "Barbarian",
                  Feature: "Relentless Rage",
               });
            }
            if (currentClass.level >= 12) {
               let rageIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Rage (4)";
               });
               sheet.ClassFeatures[rageIndex] = {
                  Source: "Barbarian",
                  Feature: "Rage (5)",
               };
            }
            if (currentClass.level >= 13) {
               let brutalIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Brutal Critical";
               });
               sheet.ClassFeatures[brutalIndex] = {
                  Source: "Barbarian",
                  Feature: "Brutal Critical (2 Dice)",
               };
            }
            if (currentClass.level >= 15) {
               sheet.ClassFeatures.push({
                  Source: "Barbarian",
                  Feature: "Persistent Rage",
               });
            }
            if (currentClass.level >= 17) {
               let brutalIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Brutal Critical (2 Dice)";
               });
               sheet.ClassFeatures[brutalIndex] = {
                  Source: "Barbarian",
                  Feature: "Brutal Critical (3 Dice)",
               };

               let rageIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Rage (5)";
               });
               sheet.ClassFeatures[rageIndex] = {
                  Source: "Barbarian",
                  Feature: "Rage (6)",
               };
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({
                  Source: "Barbarian",
                  Feature: "Indomitable Might",
               });
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({
                  Source: "Barbarian",
                  Feature: "Primal Champion",
               });

               let rageIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Rage (6)";
               });
               sheet.ClassFeatures[rageIndex] = {
                  Source: "Barbarian",
                  Feature: "Rage (Unlimited)",
               };

               sheet.Strength += 4;
               sheet.Constitution += 4;
            }
            break;
         case "bard":
            // saving throws
            sheet.Saves.Dexterity = i == 0 ? true : false;
            sheet.Saves.Charisma = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push("Light Armor");
            sheet.Proficiencies.Weapons.push(
               "Simple Weapons",
               "Hand Crossbows",
               "Longswords",
               "rapiers",
               "Shortswords"
            );
            sheet.Proficiencies.Tools.push("Three Musical Instruments (use !edit)");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Bard", Feature: "Bardic Inspiration (d6)" },
                  { Source: "Bard", Feature: "Spellcasting (Ritual)" }
               );
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Jack of All Trades",
               });
               for (let x = 0; x < Object.keys(sheet.Skills).length; x++) {
                  sheet.Skills[Object.keys(sheet.Skills)[x]].Half = true;
               }
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Song of Rest (d6)",
               });
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Expertise (3rd Level)",
               });
               console.log("SEND MESSAGE TO !EDIT EXPERTISE");
            }
            if (currentClass.level >= 5) {
               let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Bardic Inspiration (d6)";
               });
               sheet.ClassFeatures[bardicIndex] = {
                  Source: "Bard",
                  Feature: "Bardic Inspiration (d8)",
               };
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Font of Inspiration",
               });
            }
            if (currentClass.level >= 9) {
               let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Song of Rest (d6)";
               });
               sheet.ClassFeatures[bardicIndex] = {
                  Source: "Bard",
                  Feature: "Song of Rest (d8)",
               };
            }
            if (currentClass.level >= 10) {
               let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Bardic Inspiration (d8)";
               });
               sheet.ClassFeatures[bardicIndex] = {
                  Source: "Bard",
                  Feature: "Bardic Inspiration (d10)",
               };
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Expertise (10th Level)",
               });
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Magical Secrets (10th Level)",
               });
            }
            if (currentClass.level >= 13) {
               let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Song of Rest (d8)";
               });
               sheet.ClassFeatures[bardicIndex] = {
                  Source: "Bard",
                  Feature: "Song of Rest (d10)",
               };
            }
            if (currentClass.level >= 14) {
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Magical Secrets (14th Level)",
               });
            }
            if (currentClass.level >= 15) {
               let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Bardic Inspiration (d10)";
               });
               sheet.ClassFeatures[bardicIndex] = {
                  Source: "Bard",
                  Feature: "Bardic Inspiration (d12)",
               };
            }
            if (currentClass.level >= 17) {
               let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Song of Rest (d10)";
               });
               sheet.ClassFeatures[bardicIndex] = {
                  Source: "Bard",
                  Feature: "Song of Rest (d12)",
               };
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Magical Secrets (18th Level)",
               });
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({
                  Source: "Bard",
                  Feature: "Superior Inspiration",
               });
            }
            break;
         case "cleric":
            // saving throws
            sheet.Saves.Wisdom = i == 0 ? true : false;
            sheet.Saves.Charisma = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push(
               "Light Armor",
               "Medium Armor",
               "Shields"
            );
            sheet.Proficiencies.Weapons.push("Simple Weapons");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push({
                  Source: "Cleric",
                  Feature: "Spellcasting (Ritual)",
               });
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Cleric",
                  Feature: "Channel Divinity (1)",
               });
            }
            if (currentClass.level >= 5) {
               sheet.ClassFeatures.push({
                  Source: "Cleric",
                  Feature: "Destroy Undead (CR 1/2)",
               });
            }
            if (currentClass.level >= 6) {
               let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Channel Divinity (1)";
               });
               sheet.ClassFeatures[clericIndex] = {
                  Source: "Cleric",
                  Feature: "Channel Divinity (2)",
               };
            }
            if (currentClass.level >= 8) {
               let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Destroy Undead (CR 1/2)";
               });
               sheet.ClassFeatures[clericIndex] = {
                  Source: "Cleric",
                  Feature: "Destroy Undead (CR 1)",
               };
            }
            if (currentClass.level >= 10) {
               sheet.ClassFeatures.push({
                  Source: "Cleric",
                  Feature: "Divine Intervention",
               });
            }
            if (currentClass.level >= 11) {
               let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Destroy Undead (CR 1)";
               });
               sheet.ClassFeatures[clericIndex] = {
                  Source: "Cleric",
                  Feature: "Destroy Undead (CR 2)",
               };
            }
            if (currentClass.level >= 14) {
               let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Destroy Undead (CR 2)";
               });
               sheet.ClassFeatures[clericIndex] = {
                  Source: "Cleric",
                  Feature: "Destroy Undead (CR 3)",
               };
            }
            if (currentClass.level >= 17) {
               let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Destroy Undead (CR 3)";
               });
               sheet.ClassFeatures[clericIndex] = {
                  Source: "Cleric",
                  Feature: "Destroy Undead (CR 4)",
               };
            }
            if (currentClass.level >= 18) {
               let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Channel Divinity (2)";
               });
               sheet.ClassFeatures[clericIndex] = {
                  Source: "Cleric",
                  Feature: "Channel Divinity (3)",
               };
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({
                  Source: "Cleric",
                  Feature: "Divine Intervention Improvement",
               });
            }
            break;
         case "druid":
            // saving throws
            sheet.Saves.Wisdom = i == 0 ? true : false;
            sheet.Saves.Intelligence = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push(
               "Light Armor",
               "Medium Armor",
               "Shields"
            );
            sheet.Proficiencies.Weapons.push(
               "Clubs",
               "daggers",
               "darts",
               "javelins",
               "maces",
               "quarterstaffs",
               "scimitars",
               "sickles",
               "slings",
               "spears"
            );
            sheet.Proficiencies.Tools.push("Herbalism Kit");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Druid", Feature: "Spellcasting (Ritual)" },
                  { Source: "Druid", Feature: "Druidic" }
               );
               sheet.Languages.push("Druidic");
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Druid",
                  Feature: "Wild Shape (CR 1/4)",
               });
            }
            if (currentClass.level >= 4) {
               let druidIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Wild Shape (CR 1/4)";
               });
               sheet.ClassFeatures[druidIndex] = {
                  Source: "Druid",
                  Feature: "Wild Shape (CR 1/2)",
               };
            }
            if (currentClass.level >= 8) {
               let druidIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Wild Shape (CR 1/2)";
               });
               sheet.ClassFeatures[druidIndex] = {
                  Source: "Druid",
                  Feature: "Wild Shape (CR 1)",
               };
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push(
                  { Source: "Druid", Feature: "Timeless Body" },
                  { Source: "Druid", Feature: "Beast Spell" }
               );
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({ Source: "Druid", Feature: "Archdruid" });
            }
            break;
         case "fighter":
            // saving throws
            sheet.Saves.Constitution = i == 0 ? true : false;
            sheet.Saves.Intelligence = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push("All Armor", "Shields");
            sheet.Proficiencies.Weapons.push("Simple Weapons", "Martial Weapons");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Fighter", Feature: "Fighting Style" },
                  { Source: "Fighter", Feature: "Second Wind" }
               );
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Fighter",
                  Feature: "Action Surge (1)",
               });
            }
            if (currentClass.level >= 5) {
               sheet.ClassFeatures.push({
                  Source: "Fighter",
                  Feature: "Extra Attack (1)",
               });
            }
            if (currentClass.level >= 8) {
               sheet.ClassFeatures.push({
                  Source: "Fighter",
                  Feature: "Indomitable (1)",
               });
            }
            if (currentClass.level >= 11) {
               let fighterIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Extra Attack (1)";
               });
               sheet.ClassFeatures[fighterIndex] = {
                  Source: "Fighter",
                  Feature: "Extra Attack (2)",
               };
            }
            if (currentClass.level >= 13) {
               let fighterIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Indomitable (1)";
               });
               sheet.ClassFeatures[fighterIndex] = {
                  Source: "Fighter",
                  Feature: "Indomitable (2)",
               };
            }
            if (currentClass.level >= 17) {
               let fighterIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Action Surge (1)";
               });
               sheet.ClassFeatures[fighterIndex] = {
                  Source: "Fighter",
                  Feature: "Action Surge (2)",
               };

               fighterIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Indomitable (2)";
               });
               sheet.ClassFeatures[fighterIndex] = {
                  Source: "Fighter",
                  Feature: "Indomitable (3)",
               };
            }
            if (currentClass.level >= 20) {
               let fighterIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Extra Attack (2)";
               });
               sheet.ClassFeatures[fighterIndex] = {
                  Source: "Fighter",
                  Feature: "Extra Attack (3)",
               };
            }
            break;
         case "monk":
            // saving throws
            sheet.Saves.Strength = i == 0 ? true : false;
            sheet.Saves.Dexterity = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Weapons.push("Simple Weapons", "Shortswords");
            sheet.Proficiencies.Tools.push(
               "One type of artisan’s tools or One musical instrument (use !edit)"
            );

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Monk", Feature: "Unarmored Defense" },
                  { Source: "Monk", Feature: "Martial Arts (d4)" }
               );
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push(
                  { Source: "Monk", Feature: "Ki" },
                  { Source: "Monk", Feature: "Unarmored Movement (+10 ft)" }
               );
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({
                  Source: "Monk",
                  Feature: "Deflect Missiles",
               });
            }
            if (currentClass.level >= 4) {
               sheet.ClassFeatures.push({ Source: "Monk", Feature: "Slow Fall" });
            }
            if (currentClass.level >= 5) {
               sheet.ClassFeatures.push(
                  { Source: "Monk", Feature: "Extra Attack" },
                  { Source: "Monk", Feature: "Stunning Strike" }
               );

               let monkIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Martial Arts (d4)";
               });
               sheet.ClassFeatures[monkIndex] = {
                  Source: "Monk",
                  Feature: "Martial Arts (d6)",
               };
            }
            if (currentClass.level >= 6) {
               sheet.ClassFeatures.push({
                  Source: "Monk",
                  Feature: "Ki-Empowered Strikes",
               });
               let monkIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Unarmored Movement (+10 ft)";
               });
               sheet.ClassFeatures[monkIndex] = {
                  Source: "Monk",
                  Feature: "Unarmored Movement (+15 ft)",
               };
            }
            if (currentClass.level >= 7) {
               sheet.ClassFeatures.push(
                  { Source: "Monk", Feature: "Evasion" },
                  { Source: "Monk", Feature: "Stillness of Mind" }
               );
            }
            if (currentClass.level >= 9) {
               sheet.ClassFeatures.push({
                  Source: "Monk",
                  Feature: "Unarmored Movement Improvement",
               });
            }
            if (currentClass.level >= 10) {
               sheet.ClassFeatures.push({
                  Source: "Monk",
                  Feature: "Purity of Body",
               });

               let monkIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Unarmored Movement (+15 ft)";
               });
               sheet.ClassFeatures[monkIndex] = {
                  Source: "Monk",
                  Feature: "Unarmored Movement (+20 ft)",
               };
            }
            if (currentClass.level >= 11) {
               let monkIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Martial Arts (d6)";
               });
               sheet.ClassFeatures[monkIndex] = {
                  Source: "Monk",
                  Feature: "Martial Arts (d8)",
               };
            }
            if (currentClass.level >= 13) {
               sheet.ClassFeatures.push({
                  Source: "Monk",
                  Feature: "Tongue of the Sun and Moon",
               });
            }
            if (currentClass.level >= 14) {
               sheet.ClassFeatures.push({ Source: "Monk", Feature: "Diamond Soul" });
               sheet.Saves.Strength = true;
               sheet.Saves.Dexterity = true;
               sheet.Saves.Constitution = true;
               sheet.Saves.Intelligence = true;
               sheet.Saves.Wisdom = true;
               sheet.Saves.Charisma = true;

               let monkIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Unarmored Movement (+20 ft)";
               });
               sheet.ClassFeatures[monkIndex] = {
                  Source: "Monk",
                  Feature: "Unarmored Movement (+25 ft)",
               };
            }
            if (currentClass.level >= 15) {
               sheet.ClassFeatures.push({
                  Source: "Monk",
                  Feature: "Timeless Body",
               });
            }
            if (currentClass.level >= 17) {
               let monkIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Martial Arts (d8)";
               });
               sheet.ClassFeatures[monkIndex] = {
                  Source: "Monk",
                  Feature: "Martial Arts (d10)",
               };
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({ Source: "Monk", Feature: "Empty Body" });

               let monkIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Unarmored Movement (+25 ft)";
               });
               sheet.ClassFeatures[monkIndex] = {
                  Source: "Monk",
                  Feature: "Unarmored Movement (+30 ft)",
               };
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({ Source: "Monk", Feature: "Perfect Soul" });
            }
            break;
         case "paladin":
            // saving throws
            sheet.Saves.Wisdom = i == 0 ? true : false;
            sheet.Saves.Charisma = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push("All Armor", "Shields");
            sheet.Proficiencies.Weapons.push("Simple Weapons", "Martial Weapons");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Paladin", Feature: "Divine Sense" },
                  { Source: "Paladin", Feature: "Lay on Hands" }
               );
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push(
                  { Source: "Paladin", Feature: "Fighting Style" },
                  { Source: "Paladin", Feature: "Spellcasting" },
                  { Source: "Paladin", Feature: "Divine Smite" }
               );
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({
                  Source: "Paladin",
                  Feature: "Divine Health",
               });
            }
            if (currentClass.level >= 5) {
               sheet.ClassFeatures.push({
                  Source: "Paladin",
                  Feature: "Extra Attack",
               });
            }
            if (currentClass.level >= 6) {
               sheet.ClassFeatures.push({
                  Source: "Paladin",
                  Feature: "Aura of Protection (10 ft.)",
               });
            }
            if (currentClass.level >= 10) {
               sheet.ClassFeatures.push({
                  Source: "Paladin",
                  Feature: "Aura of Courage (10 ft.)",
               });
            }
            if (currentClass.level >= 11) {
               sheet.ClassFeatures.push({
                  Source: "Paladin",
                  Feature: "Improved Divine Smite",
               });
            }
            if (currentClass.level >= 14) {
               sheet.ClassFeatures.push({
                  Source: "Paladin",
                  Feature: "Cleaning Touch",
               });
            }
            if (currentClass.level >= 18) {
               let paladinIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Aura of Protection (10 ft.)";
               });
               sheet.ClassFeatures[paladinIndex] = {
                  Source: "Paladin",
                  Feature: "Aura of Protection (30 ft.)",
               };

               paladinIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Aura of Courage (10 ft.)";
               });
               sheet.ClassFeatures[paladinIndex] = {
                  Source: "Paladin",
                  Feature: "Aura of Courage (30 ft.)",
               };
            }
            break;
         case "ranger":
            // saving throws
            sheet.Saves.Strength = i == 0 ? true : false;
            sheet.Saves.Dexterity = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push(
               "Light Armor",
               "Medium Armor",
               "Shields"
            );
            sheet.Proficiencies.Weapons.push("Simple Weapons", "Martial Weapons");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Ranger", Feature: "Favored Enemy (1)" },
                  { Source: "Ranger", Feature: "Natural Explorer (1)" }
               );
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push(
                  { Source: "Ranger", Feature: "Fighting Style" },
                  { Source: "Ranger", Feature: "Spellcasting" }
               );
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({
                  Source: "Ranger",
                  Feature: "Primeval Awareness",
               });
            }
            if (currentClass.level >= 5) {
               sheet.ClassFeatures.push({
                  Source: "Ranger",
                  Feature: "Extra Attack",
               });
            }
            if (currentClass.level >= 6) {
               let rangerIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Favored Enemy (1)";
               });
               sheet.ClassFeatures[rangerIndex] = {
                  Source: "Ranger",
                  Feature: "Favored Enemy (2)",
               };

               rangerIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Natural Explorer (1)";
               });
               sheet.ClassFeatures[rangerIndex] = {
                  Source: "Ranger",
                  Feature: "Natural Explorer (2)",
               };
            }
            if (currentClass.level >= 8) {
               sheet.ClassFeatures.push({
                  Source: "Ranger",
                  Feature: "Land's Stride",
               });
            }
            if (currentClass.level >= 10) {
               sheet.ClassFeatures.push({
                  Source: "Ranger",
                  Feature: "Hide in Plain Sight",
               });

               let rangerIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Natural Explorer (2)";
               });
               sheet.ClassFeatures[rangerIndex] = {
                  Source: "Ranger",
                  Feature: "Natural Explorer (3)",
               };
            }
            if (currentClass.level >= 14) {
               sheet.ClassFeatures.push({ Source: "Ranger", Feature: "Vanish" });

               let rangerIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Favored Enemy (2)";
               });
               sheet.ClassFeatures[rangerIndex] = {
                  Source: "Ranger",
                  Feature: "Favored Enemy (3)",
               };
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({
                  Source: "Ranger",
                  Feature: "Feral Senses",
               });
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({ Source: "Ranger", Feature: "Foe Slayer" });
            }
            break;
         case "rogue":
            // saving throws
            sheet.Saves.Dexterity = i == 0 ? true : false;
            sheet.Saves.Intelligence = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push("Light Armor");
            sheet.Proficiencies.Weapons.push(
               "Simple Weapons",
               "Hand Crossbows",
               "Longswords",
               "Rapiers",
               "Shortswords"
            );
            sheet.Proficiencies.Tools.push("Thieves' Tools");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Rogue", Feature: "Expertise (1st Level)" },
                  { Source: "Rogue", Feature: "Sneak Attack (1d6)" },
                  { Source: "Rogue", Feature: "Thieves' Cant" }
               );
               sheet.Languages.push(`Thieves' Cant`);
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Rogue",
                  Feature: "Cunning Action",
               });
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({
                  Source: "Rogue",
                  Feature: "The Right Tool for the Job",
               });

               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (1d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (2d6)",
               };
            }
            if (currentClass.level >= 5) {
               sheet.ClassFeatures.push({
                  Source: "Rogue",
                  Feature: "Uncanny Dodge",
               });

               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (2d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (3d6)",
               };
            }
            if (currentClass.level >= 6) {
               sheet.ClassFeatures.push({
                  Source: "Rogue",
                  Feature: "Expertise (6th Level)",
               });
            }
            if (currentClass.level >= 7) {
               sheet.ClassFeatures.push({ Source: "Rogue", Feature: "Evasion" });

               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (3d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (4d6)",
               };
            }
            if (currentClass.level >= 9) {
               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (4d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (5d6)",
               };
            }
            if (currentClass.level >= 11) {
               sheet.ClassFeatures.push({
                  Source: "Rogue",
                  Feature: "Reliable Talent",
               });

               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (5d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (6d6)",
               };
            }
            if (currentClass.level >= 13) {
               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (6d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (7d6)",
               };
            }
            if (currentClass.level >= 14) {
               sheet.ClassFeatures.push({ Source: "Rogue", Feature: "Blindsense" });
            }
            if (currentClass.level >= 15) {
               sheet.ClassFeatures.push({
                  Source: "Rogue",
                  Feature: "Slippery Mind",
               });
               sheet.Saves.Wisdom = true;

               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (7d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (8d6)",
               };
            }
            if (currentClass.level >= 17) {
               sheet.Saves.Wisdom = true;

               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (8d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (9d6)",
               };
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({ Source: "Rogue", Feature: "Elusive" });
            }
            if (currentClass.level >= 19) {
               sheet.ClassFeatures.push({
                  Source: "Rogue",
                  Feature: "Stroke of Luck",
               });

               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Sneak Attack (9d6)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Rogue",
                  Feature: "Sneak Attack (10d6)",
               };
            }
            break;
         case "sorcerer":
            // saving throws
            sheet.Saves.Constitution = i == 0 ? true : false;
            sheet.Saves.Charisma = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Weapons.push(
               "Daggers",
               "Darts",
               "Slings",
               "Quarterstaffs",
               "Light Crossbows"
            );

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push({
                  Source: "Sorcerer",
                  Feature: "Spellcasting",
               });
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Sorcerer",
                  Feature: "Font of Magic",
               });
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({
                  Source: "Sorcerer",
                  Feature: "Metamagic (2)",
               });
            }
            if (currentClass.level >= 10) {
               let sorcererIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Metamagic (2)";
               });
               sheet.ClassFeatures[sorcererIndex] = {
                  Source: "Sorcerer",
                  Feature: "Metamagic (3)",
               };
            }
            if (currentClass.level >= 17) {
               let rogueIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Metamagic (3)";
               });
               sheet.ClassFeatures[rogueIndex] = {
                  Source: "Sorcerer",
                  Feature: "Metamagic (4)",
               };
            }
            if (currentClass.level >= 10) {
               sheet.ClassFeatures.push({
                  Source: "Sorcerer",
                  Feature: "Magic Item Adept",
               });
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({
                  Source: "Sorcerer",
                  Feature: "Sorcerous Restoration",
               });
            }
            break;
         case "warlock":
            // saving throws
            sheet.Saves.Wisdom = i == 0 ? true : false;
            sheet.Saves.Charisma = i == 0 ? true : false;

            // Proficiencies
            sheet.Proficiencies.Armor.push("Light Armor");
            sheet.Proficiencies.Weapons.push("Simple Weapons");

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Pact Magic",
               });
            }
            if (currentClass.level >= 2) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Eldritch Invocations (2)",
               });
            }
            if (currentClass.level >= 3) {
               sheet.ClassFeatures.push({ Source: "Warlock", Feature: "Pact Boon" });
            }
            if (currentClass.level >= 5) {
               let warlockIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Eldritch Invocations (2)";
               });
               sheet.ClassFeatures[warlockIndex] = {
                  Source: "Warlock",
                  Feature: "Eldritch Invocations (3)",
               };
            }
            if (currentClass.level >= 7) {
               let warlockIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Eldritch Invocations (3)";
               });
               sheet.ClassFeatures[warlockIndex] = {
                  Source: "Warlock",
                  Feature: "Eldritch Invocations (4)",
               };
            }
            if (currentClass.level >= 9) {
               let warlockIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Eldritch Invocations (4)";
               });
               sheet.ClassFeatures[warlockIndex] = {
                  Source: "Warlock",
                  Feature: "Eldritch Invocations (5)",
               };
            }
            if (currentClass.level >= 11) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Mystic Arcanum (6th Level)",
               });
            }
            if (currentClass.level >= 12) {
               let warlockIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Eldritch Invocations (5)";
               });
               sheet.ClassFeatures[warlockIndex] = {
                  Source: "Warlock",
                  Feature: "Eldritch Invocations (6)",
               };
            }
            if (currentClass.level >= 13) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Mystic Arcanum (7th Level)",
               });
            }
            if (currentClass.level >= 15) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Mystic Arcanum (8th Level)",
               });

               let warlockIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Eldritch Invocations (6)";
               });
               sheet.ClassFeatures[warlockIndex] = {
                  Source: "Warlock",
                  Feature: "Eldritch Invocations (7)",
               };
            }
            if (currentClass.level >= 17) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Mystic Arcanum (9th Level)",
               });
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Mystic Arcanum (8th Level)",
               });

               let warlockIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                  return feature.Feature === "Eldritch Invocations (7)";
               });
               sheet.ClassFeatures[warlockIndex] = {
                  Source: "Warlock",
                  Feature: "Eldritch Invocations (8)",
               };
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({
                  Source: "Warlock",
                  Feature: "Eldritch Master",
               });
            }
            break;
         case "wizard":
            // saving throws
            sheet.Saves.Wisdom = i == 0 ? true : false;
            sheet.Saves.Intelligence = i == 0 ? true : false;
            // Proficiencies
            sheet.Proficiencies.Weapons.push(
               "Daggers",
               "Darts",
               "Slings",
               "Quarterstaffs",
               "Light Crossbows"
            );

            //Level-based Features
            if (currentClass.level >= 1) {
               sheet.ClassFeatures.push(
                  { Source: "Wizard", Feature: "Arcane Recovery" },
                  { Source: "Wizard", Feature: "Spellcasting (Ritual)" }
               );
            }
            if (currentClass.level >= 18) {
               sheet.ClassFeatures.push({
                  Source: "Wizard",
                  Feature: "Spell Mastery",
               });
            }
            if (currentClass.level >= 20) {
               sheet.ClassFeatures.push({
                  Source: "Wizard",
                  Feature: "Signature Spells",
               });
            }
            break;
      }
   }
   return sheet;
}

function setRaceFeatures(sheet) {
   sheet.RaceFeatures = [];
   switch (sheet.Race.toLowerCase()) {
   }
   return sheet;
}

function setSubclassFeatures(sheet) {
   for (let i = 0; i < sheet.Classes.length; i++) {
      switch (sheet.Classes[i].name.toLowerCase()) {
         case "artificer":
            if (sheet.Classes[i].level >= 3)
               switch (sheet.Classes[i].subclass.toLowerCase()) {
                  case "alchemist":
                     //lvl 3 features
                     sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Alchemist", "Feature": "Tool Proficiency" }, { "Source": "Artificer Specialist - Alchemist", "Feature": "Alchemist Spells" }, { "Source": "Artificer Specialist - Alchemist", "Feature": "Experimental Elixir (1)" });
                     sheet.Proficiencies.Tools.push('Alchemist\'s Supplies');
                     if (sheet.Classes[i].level >= 5)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Alchemist", "Feature": "Alchemical Savant" });
                     if (sheet.Classes[i].level >= 6) {
                        let alchemicalIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Experimental Elixir (1)";
                        });
                        sheet.ClassFeatures[alchemicalIndex] = {
                           Source: "Artificer Specialist - Alchemist",
                           Feature: "Experimental Elixir (2)",
                        };
                     }
                     if (sheet.Classes[i].level >= 9)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Alchemist", "Feature": "Restorative Reagents" });
                     if (sheet.Classes[i].level >= 15) {
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Alchemist", "Feature": "Chemical Mastery" });
                        let alchemicalIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Experimental Elixir (2)";
                        });
                        sheet.ClassFeatures[alchemicalIndex] = {
                           Source: "Artificer Specialist - Alchemist",
                           Feature: "Experimental Elixir (3)",
                        };
                     }
                     break;
                  case "armorer":
                     //lvl 3 features
                     sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Armorer", "Feature": "Tool Tools of the Trade" }, { "Source": "Artificer Specialist - Armorer", "Feature": "Armorer Spells" }, { "Source": "Artificer Specialist - Armorer", "Feature": "Arcane Armor" }, { "Source": "Artificer Specialist - Armorer", "Feature": "Armor Model" });
                     sheet.Proficiencies.Tools.push('Smith\'s Tools');
                     if (sheet.Classes[i].level >= 5)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Armorer", "Feature": "Extra Attack" });
                     if (sheet.Classes[i].level >= 9)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Armorer", "Feature": "Armor Modifications" });
                     if (sheet.Classes[i].level >= 15)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Armorer", "Feature": "Perfected Armor" });
                     break;
                  case "artillerist":
                     //lvl 3 features
                     sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Artillerist", "Feature": "Tool Proficiency" }, { "Source": "Artificer Specialist - Artillerist", "Feature": "Artillerist Spells" }, { "Source": "Artificer Specialist - Artillerist", "Feature": "Eldritch Cannon" });
                     sheet.Proficiencies.Tools.push('Smith\'s Tools');
                     if (sheet.Classes[i].level >= 5)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Artillerist", "Feature": "Arcane Firearm" });
                     if (sheet.Classes[i].level >= 9)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Artillerist", "Feature": "Explosive Canon" });
                     if (sheet.Classes[i].level >= 15)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Artillerist", "Feature": "Fortified Position" });
                     break;
                  case "battle smith":
                     //lvl 3 features
                     sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Battle Smith", "Feature": "Tool Proficiency" }, { "Source": "Artificer Specialist - Battle Smith", "Feature": "Battle Smith Spells" }, { "Source": "Artificer Specialist - Battle Smith", "Feature": "Battle Ready" }, { "Source": "Artificer Specialist - Battle Smith", "Feature": "Steel Defender" });
                     if (!sheet.Proficiencies.Tools.includes('Smith\'s Tools')) sheet.Proficiencies.Tools.push('Smith\'s Tools');
                     sheet.Proficiencies.Weapons.push('Martial');
                     if (sheet.Classes[i].level >= 5)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Battle Smith", "Feature": "Extra Attack" });
                     if (sheet.Classes[i].level >= 9)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Battle Smith", "Feature": "Arcane Jolt" });
                     if (sheet.Classes[i].level >= 15)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Battle Smith", "Feature": "Improved Defender" });
                     break;
                  case "maverick":
                     //lvl 3 features
                     sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Maverick", "Feature": "Arcane Breakthroughs" }, { "Source": "Artificer Specialist - Maverick", "Feature": "Cantrip Specialist" });
                     if (sheet.Classes[i].level >= 5)
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Maverick", "Feature": "Cantrip Savant (+1)" });
                     if (sheet.Classes[i].level >= 9) {
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Maverick", "Feature": "Superior Breakthroughs" });
                        let maverickIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Cantrip Savant (+1)";
                        });
                        sheet.ClassFeatures[maverickIndex] = {
                           Source: "Artificer Specialist - Maverick",
                           Feature: "Cantrip Savant (+2)",
                        };
                     }
                     if (sheet.Classes[i].level >= 15) {
                        sheet.ClassFeatures.push({ "Source": "Artificer Specialist - Maverick", "Feature": "Final Breakthrough" });
                        let maverickIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Cantrip Savant (+2)";
                        });
                        sheet.ClassFeatures[maverickIndex] = {
                           Source: "Artificer Specialist - Maverick",
                           Feature: "Cantrip Savant (+3)",
                        };
                     }
                     break;
               }
            break;
         case "barbarian":
            if (sheet.Classes[i].level >= 3) {
               switch (sheet.Classes[i].subclass.toLowerCase()) {
                  case "path of the beast":
                     sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Beast", "Feature": "Form of the Beast" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Beast", "Feature": "Bestial Soul" });
                     if (sheet.Classes[i].level >= 10)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Beast", "Feature": "Infectious Fury" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Beast", "Feature": "Call of the Hunt" });
                     break;
                  case "path of the berserker":
                     sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Berserker", "Feature": "Frenzy" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Berserker", "Feature": "Mindless Rage" });
                     if (sheet.Classes[i].level >= 10)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Berserker", "Feature": "Intimidating Presence" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of the Berserker", "Feature": "Retaliation" });
                     break;
                  case "path of wild magic":
                     sheet.ClassFeatures.push({ "Source": "Primal Path - Path of Wild Magic", "Feature": "Form of Wild Surge" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of Wild MAgic", "Feature": "Bolstering Magic" });
                     if (sheet.Classes[i].level >= 10)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of Wild MAgic", "Feature": "Unstable Backlash" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Primal Path - Path of Wild MAgic", "Feature": "Controlled Surge" });
                     break;
               }
            }
            break;
         case "bard":
            if (sheet.Classes[i].level >= 3) {
               switch (sheet.Classes[i].subclass.toLowerCase()) {
                  case "college of creation":
                     sheet.ClassFeatures.push({ "Source": "Bard College - College of Creation", "Feature": "Mote of Potential" }, { "Source": "Bard College - College of Creation", "Feature": "Performance of Creation (Medium)" });
                     if (sheet.Classes[i].level >= 6) {
                        sheet.ClassFeatures.push({ "Source": "Bard College - College of Creation", "Feature": "Animating Performance" });
                        let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Performance of Creation (Medium)";
                        });
                        sheet.ClassFeatures[bardicIndex] = {
                           Source: "Bard College - College of Creation",
                           Feature: "Performance of Creation (Large)",
                        };
                     }
                     if (sheet.Classes[i].level >= 14) {
                        sheet.ClassFeatures.push({ "Source": "Bard College - College of Creation", "Feature": "Creative Crescendo" });
                        let bardicIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Performance of Creation (Large)";
                        });
                        sheet.ClassFeatures[bardicIndex] = {
                           Source: "Bard College - College of Creation",
                           Feature: "Performance of Creation (Huge)",
                        };
                     }
                     break;
                  case "college of eloquence":
                     sheet.ClassFeatures.push({ "Source": "Bard College - College of Eloquence", "Feature": "Silver Tongue" }, { "Source": "Bard College - College of Eloquence", "Feature": "Unsettling Words" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Bard College - College of Eloquence", "Feature": "Unfailing Inspiration" }, { "Source": "Bard College - College of Eloquence", "Feature": "Universal Speech" });
                     if (sheet.Classes[i].level >= 14)
                        sheet.ClassFeatures.push({ "Source": "Bard College - College of Eloquence", "Feature": "Infectious Aspiration" });
                     break;
                  case "college of lore":
                     sheet.ClassFeatures.push({ "Source": "Bard College - College of Lore", "Feature": "Bonus Proficiencies" }, { "Source": "Bard College - College of Lore", "Feature": "Cutting Words" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Bard College - College of Lore", "Feature": "Additional Magical Secrets" });
                     if (sheet.Classes[i].level >= 14)
                        sheet.ClassFeatures.push({ "Source": "Bard College - College of Lore", "Feature": "Peerless Skill" });
                     break;
               }
            }
            break;
         case "cleric":
            switch (sheet.Classes[i].subclass.toLowerCase()) {
               case "life domain":
                  sheet.ClassFeatures.push({ "Source": "Divine Domain - Life Domain", "Feature": "Life Domain Spells" }, { "Source": "Divine Domain - Life Domain", "Feature": "Bonus Proficiency (Heavy Armor)" }, { "Source": "Divine Domain - Life Domain", "Feature": "Disciple of Life" });
                  sheet.Proficiencies.Armor.push("Heavy");
                  if (sheet.Classes[i].level >= 2)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Life Domain", "Feature": "Channel Divinity: Preserve Life" });
                  if (sheet.Classes[i].level >= 6)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Life Domain", "Feature": "Blessed Healer" });
                  if (sheet.Classes[i].level >= 8)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Life Domain", "Feature": "Divine Strike (1d8)" });
                  if (sheet.Classes[i].level >= 14) {
                     let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                        return feature.Feature === "Divine Strike (1d8)";
                     });
                     sheet.ClassFeatures[clericIndex] = {
                        Source: "Divine Domain - Life Domain",
                        Feature: "Divine Striker (2d8)",
                     };
                  }
                  if (sheet.Classes[i].level >= 17)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Life Domain", "Feature": "Supreme Healing" });

                  break;
               case "order domain":
                  sheet.ClassFeatures.push({ "Source": "Divine Domain - Order Domain", "Feature": "Order Domain Spells" }, { "Source": "Divine Domain - Order Domain", "Feature": "Bonus Proficiencies" }, { "Source": "Divine Domain - Life Domain", "Feature": "Voice of Authority" });
                  sheet.Proficiencies.Armor.push("Heavy");
                  if (sheet.Classes[i].level >= 2)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Order Domain", "Feature": "Channel Divinity: Order's Demand" });
                  if (sheet.Classes[i].level >= 6)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Order Domain", "Feature": "Embodiment of the Law" });
                  if (sheet.Classes[i].level >= 8)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Order Domain", "Feature": "Divine Strike (1d8)" });
                  if (sheet.Classes[i].level >= 14) {
                     let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                        return feature.Feature === "Divine Strike (1d8)";
                     });
                     sheet.ClassFeatures[clericIndex] = {
                        Source: "Divine Domain - Order Domain",
                        Feature: "Divine Striker (2d8)",
                     };
                  }
                  if (sheet.Classes[i].level >= 17)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Life Domain", "Feature": "Order's Wrath" });
                  break;
               case "peace domain":
                  sheet.ClassFeatures.push({ "Source": "Divine Domain - Peace Domain", "Feature": "Domain Spells" }, { "Source": "Divine Domain - Peace Domain", "Feature": "Implement of Peace" }, { "Source": "Divine Domain - Peace Domain", "Feature": "Emboldening Bond" });
                  if (sheet.Classes[i].level >= 2)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Peace Domain", "Feature": "Channel Divinity: Balm of Peace" });
                  if (sheet.Classes[i].level >= 6)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Peace Domain", "Feature": "Protective Bond" });
                  if (sheet.Classes[i].level >= 8)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Peace Domain", "Feature": "Potent Spellcasting" });
                  if (sheet.Classes[i].level >= 17)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Peace Domain", "Feature": "Expansive Bond" });
                  break;
               case "twilight domain":
                  sheet.ClassFeatures.push({ "Source": "Divine Domain - Twilight Domain", "Feature": "Domain Spells" }, { "Source": "Divine Domain - Twilight Domain", "Feature": "Eyes of Night" }, { "Source": "Divine Domain  - Twilight Domain", "Feature": "Vigilant Blessing" });
                  sheet.Proficiencies.Armor.push("Heavy");
                  sheet.Proficiencies.Weapons.push("Martial");
                  if (sheet.Classes[i].level >= 2)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Twilight Domain", "Feature": "Channel Divinity: Twilight Sanctuary" });
                  if (sheet.Classes[i].level >= 6)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Twilight Domain", "Feature": "Steps of Night" });
                  if (sheet.Classes[i].level >= 8)
                     sheet.ClassFeatures.push({ "Source": "Divine Domain - Twilight Domain", "Feature": "Divine Strike (1d8)" });
                  if (sheet.Classes[i].level >= 14) {
                     let clericIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                        return feature.Feature === "Divine Strike (1d8)";
                     });
                     sheet.ClassFeatures[clericIndex] = {
                        Source: "Divine Domain - Twilight Domain",
                        Feature: "Divine Striker (2d8)",
                     };
                  }
                  if (sheet.Classes[i].level >= 17)
                     sheet.ClassFeatures.push({ "Source": "Twilight Domain - Life Domain", "Feature": "Twilight Shroud" });
                  break;
            }
            break;
         case "druid":
            if (sheet.Classes[i].level >= 2)
               switch (sheet.Classes[i].subclass.toLowerCase()) {
                  case "circle of spores":
                     sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Spores", "Feature": "Circle Spells" }, { "Source": "Druid Circle - Circle of Spores", "Feature": "Halo of Spores (1d4)" }, { "Source": "Druid Circle - Circle of Spores", "Feature": "Symbiotic Entity" });
                     if (sheet.Classes[i].level >= 6) {
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Spores", "Feature": "Fungal Infestation" });
                        let druidIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Halo of Spores (1d4)";
                        });
                        sheet.ClassFeatures[druidIndex] = {
                           Source: "Divine Domain - Twilight Domain",
                           Feature: "Halo of Spores (1d6)",
                        };
                     }
                     if (sheet.Classes[i].level >= 10) {
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Spores", "Feature": "Spreading Spores" });
                        let druidIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Halo of Spores (1d6)";
                        });
                        sheet.ClassFeatures[druidIndex] = {
                           Source: "Divine Domain - Twilight Domain",
                           Feature: "Halo of Spores (1d8)",
                        };
                     }
                     if (sheet.Classes[i].level >= 14) {
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Spores", "Feature": "Fungal Body" });
                        let druidIndex = sheet.ClassFeatures.findIndex((feature, i) => {
                           return feature.Feature === "Halo of Spores (1d8)";
                        });
                        sheet.ClassFeatures[druidIndex] = {
                           Source: "Divine Domain - Twilight Domain",
                           Feature: "Halo of Spores (1d10)",
                        };
                     }
                     break;
                  case "circle of stars":
                     sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Stars", "Feature": "Star Map" }, { "Source": "Druid Circle - Circle of Stars", "Feature": "Starry Form" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Stars", "Feature": "Cosmic Omen" });
                     if (sheet.Classes[i].level >= 10)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Stars", "Feature": "Twinkling Constellations" });
                     if (sheet.Classes[i].level >= 14)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Stars", "Feature": "Full of Stars" });
                     break;
                  case "circle of the land":
                     sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of the Land", "Feature": "Bonus Cantrip" }, { "Source": "Druid Circle - Circle of the Land", "Feature": "Natural Recovery" });
                     if (sheet.Classes[i].level >= 3)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of the Land", "Feature": "Circle Spells" })
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of the Land", "Feature": "Land's Stride" });
                     if (sheet.Classes[i].level >= 10)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of the Land", "Feature": "Nature's Ward" });
                     if (sheet.Classes[i].level >= 14)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of the Land", "Feature": "Nature's Sanctuary" });
                     break;
                  case "circle of wildfire":
                     sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Wildfire", "Feature": "Circle Spells" }, { "Source": "Druid Circle - Circle of Wildfire", "Feature": "Summon Wildfire Spirit" });
                     if (sheet.Classes[i].level >= 6)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Wildfire", "Feature": "Enhance Bond" });
                     if (sheet.Classes[i].level >= 10)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Wildfire", "Feature": "Cauterizing Flames" });
                     if (sheet.Classes[i].level >= 14)
                        sheet.ClassFeatures.push({ "Source": "Druid Circle - Circle of Wildfire", "Feature": "Blazing Revival" });
                     break;
               }
            break;
         case "fighter":
            break;
         case "monk":
            break;
         case "paladin":
            break;
         case "ranger":
            break;
         case "rogue":
            break;
         case "sorcerer":
            break;
         case "warlock":
            break;
         case "wizard":
            break;
      }
   }
}

function setAllFeatures(sheet) {
   sheet = setClassFeatures(sheet);
   sheet = setSubclassFeatures(sheet);
   return setRaceFeatures(sheet);
}

module.exports = {
   getSheetEmbed,
   getDefault,
   setDefault,
   getCheckType,
   getProfBonus,
   getCheckBonus,
   setClassFeatures,
   setSubclassFeatures,
   setRaceFeatures,
   setAllFeatures,
};
