// import { MessageEmbed } from "discord.js";
class CharacterSheet {
    // Stats
    armorClass;
    charisma;
    constitution;
    dexterity;
    initiative;
    intelligence;
    passInsight;
    passInvestigation;
    passPerception;
    strength;
    wisdom;
    skills;
    // Racial
    darkVision;
    flightSpeed;
    height;
    languages;
    race;
    racialTraits;
    size;
    speed;
    swimSpeed;
    // Classes
    armorProficiencies;
    classes;
    proficiencyBonus;
    savingThrows;
    toolProficiencies;
    totalLevel;
    weaponProficiencies;
    // Other
    age;
    alignment;
    allies;
    background;
    backstory;
    bonds;
    enemies;
    eyeColor;
    faith;
    feats;
    flaws;
    gender;
    hairColor;
    ideals;
    immunities;
    organizations;
    otherNotes;
    personalityTraits;
    pronouns;
    resistances;
    savingThrowBonuses; // Racial or Class Bonuses
    skinColor;
    vulnerabilities;
    weight;
    constructor(character) {
        this.age = character.age;
        this.alignment = character.alignment;
        this.allies = character.allies;
        this.armorClass = character.armorClass;
        this.armorProficiencies = character.armorProficiencies;
        this.background = character.background;
        this.backstory = character.backstory;
        this.bonds = character.bonds;
        this.charisma = character.charisma;
        this.classes = character.classes;
        this.constitution = character.constitution;
        this.darkVision = character.darkVision;
        this.dexterity = character.dexterity;
        this.enemies = character.enemies;
        this.eyeColor = character.eyeColor;
        this.faith = character.faith;
        this.feats = character.feats;
        this.flaws = character.flaws;
        this.gender = character.gender;
        this.hairColor = character.hairColor;
        this.height = character.height;
        this.ideals = character.ideals;
        this.immunities = character.immunities;
        this.initiative = character.initiative;
        this.intelligence = character.intelligence;
        this.languages = character.languages;
        this.organizations = character.organizations;
        this.otherNotes = character.otherNotes;
        this.passInsight = character.passInsight;
        this.passInvestigation = character.passInvestigation;
        this.passPerception = character.passPerception;
        this.personalityTraits = character.personalityTraits;
        this.proficiencyBonus = character.proficiencyBonus;
        this.pronouns = character.pronouns;
        this.race = character.race;
        this.racialTraits = character.racialTraits;
        this.resistances = character.resistances;
        this.savingThrowBonuses = character.savingThrowBonuses;
        this.savingThrows = character.savingThrows;
        this.size = character.size;
        this.skills = character.skills;
        this.skinColor = character.skinColor;
        this.speed = character.speed;
        this.strength = character.strength;
        this.swimSpeed = character.swimSpeed;
        this.toolProficiencies = character.toolProficiencies;
        this.totalLevel = character.totalLevel;
        this.vulnerabilities = character.vulnerabilities;
        this.weaponProficiencies = character.weaponProficiencies;
        this.weight = character.weight;
        this.wisdom = character.wisdom;
        this.flightSpeed = character.flightSpeed;
    }
    toJSON() {
        return {
            age: this.age,
            alignment: this.alignment,
            allies: this.allies,
            armorClass: this.armorClass,
            armorProficiencies: this.armorProficiencies,
            background: this.background,
            backstory: this.backstory,
            bonds: this.bonds,
            charisma: this.charisma,
            classes: this.classes,
            constitution: this.constitution,
            darkVision: this.darkVision,
            dexterity: this.dexterity,
            enemies: this.enemies,
            eyeColor: this.eyeColor,
            faith: this.faith,
            feats: this.feats,
            flaws: this.flaws,
            gender: this.gender,
            hairColor: this.hairColor,
            height: this.height,
            ideals: this.ideals,
            immunities: this.immunities,
            initiative: this.initiative,
            intelligence: this.intelligence,
            languages: this.languages,
            organizations: this.organizations,
            otherNotes: this.otherNotes,
            passInsight: this.passInsight,
            passInvestigation: this.passInvestigation,
            passPerception: this.passPerception,
            personalityTraits: this.personalityTraits,
            proficiencyBonus: this.proficiencyBonus,
            pronouns: this.pronouns,
            race: this.race,
            racialTraits: this.racialTraits,
            resistances: this.resistances,
            savingThrowBonuses: this.savingThrowBonuses,
            savingThrows: this.savingThrows,
            size: this.size,
            skills: this.skills,
            skinColor: this.skinColor,
            speed: this.speed,
            strength: this.strength,
            swimSpeed: this.swimSpeed,
            toolProficiencies: this.toolProficiencies,
            totalLevel: this.totalLevel,
            vulnerabilities: this.vulnerabilities,
            weaponProficiencies: this.weaponProficiencies,
            weight: this.weight,
            wisdom: this.wisdom,
        };
    }
    toEmbed() {
        // Format to make D.JS embed
    }
    setRacialFeatures() {
        switch (this.race.toLowerCase()) {
            case 'aarakocra':
                this.dexterity += 2;
                this.flightSpeed = 50;
                this.languages = ['Common', 'Aarakocra', 'Auran'];
                this.racialTraits = [{ name: 'Talons', description: 'Your talons are natural weapons, which you can use to make unarmed strikes. If you hit them, you deal slashing damaged equal to 1d4 + your Strength modifier, instead of the bludgeoning damage normal for an unarmed strike.' }, { name: 'Flight', description: 'You have a flying speed of 50 feet. To use this speed, you can\'t be wearing medium or heavy armor.' },];
                this.size = 'Medium';
                this.speed = 25;
                this.wisdom += 1;
                break;
            case 'aasimar':
                this.wisdom += 1;
                this.charisma += 2;
                this.size = 'Medium';
                this.speed = 30;
                this.darkVision = 60;
                this.racialTraits = [{ name: 'Celestial Resistance', description: 'You have resistance to necrotic and radiant damage.' }, { name: 'Celestial Legacy', description: 'You know the Light cantrip. Once you reach 3rd level, you can cast the Lesser Restoration spell once using this trait, and you regain the ability to do so when you finish a long rest. Once you reach 5th level, you can cast the Daylight spell once with this trait as a 3rd level spell, and you regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells.' }, { name: 'Darkvision', description: 'Thanks to your celestial heritage, you have superior vision in dim and dark conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' }];
                this.resistances = ['Necrotic', 'Radiant'];
                break;
            case 'fallen aasimar':
            case 'protector aasimar':
            case 'scourge aasimar':
                this.charisma += 2;
                this.size = 'Medium';
                this.speed = 30;
                this.darkVision = 60;
                this.racialTraits = [{ name: 'Celestial Resistance', description: 'You have resistance to necrotic and radiant damage.' }, { name: 'Healing Hands', description: 'As an action, you can touch a creature and cause it to regain a number of hit points equal to your level. Once you use this trait, you can\'t use it again until you finish a long rest.' }, { name: 'Darkvision', description: 'Blessed with a radiant soul, your vision can easily cut through darkness. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' }, { name: 'Light Bearer', description: 'You know the Light cantrip. Charisma is your spellcasting ability for it.' }];
                this.resistances = ['Necrotic', 'Radiant'];
                this.languages = ['Common', 'Celestial'];
            case 'fallen aasimar':
                this.strength += 1;
                this.racialTraits.push({ name: 'Necrotic Shroud', description: 'Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to turn into pools of darkness and two skeletal, ghostly, flightless wings to sprout from your back. The instant you transform, other creatures within 10 feet of you that can see you must each succeed on a Charisma saving throw (DC 8 + your proficiency bonus + your Charisma modifier) or become frightened of you until the end of your next turn.\n- Your transformation lasts for 1 minute or until you end it as a bonus action. During it, once on each of your turns, you can deal extra necrotic damage to one target when you deal damage to it with an attack or a spell. The extra necrotic damage equals your level.\n-Once you use this trait, you can\'t use it again until you finish a long rest.' });
                break;
            case 'protector aasimar':
                this.constitution += 1;
                this.racialTraits.push({ name: 'Radiant Soul', description: 'Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing your eyes to glimmer and two luminous, incorporeal wings to sprout from your back.\n-Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you have a flying speed of 30 feet, and once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.\n-Once you use this trait, you can\'t use it again until you finish a long rest.' });
                break;
            case 'scourge aasimar':
                this.constitution += 1;
                this.racialTraits.push({ name: 'Radiant Consumption', description: 'Starting at 3rd level, you can use your action to unleash the divine energy within yourself, causing a searing light to radiate from you, pour out of your eyes and mouth, and threaten to char you.\n- Your transformation lasts for 1 minute or until you end it as a bonus action. During it, you shed bright light in a 10-foot radius and dim light for an additional 10 feet, and at the end of each of your turns, you and each creature within 10 feet of you take radiant damage equal to half your level (rounded up). In addition, once on each of your turns, you can deal extra radiant damage to one target when you deal damage to it with an attack or a spell. The extra radiant damage equals your level.\n- Once you use this trait, you can\'t use it again until you finish a long rest.' });
                break;
            case 'aetherborn':
                // +1 to two other ability scores of your choice
                this.charisma += 2;
                this.darkVision = 60;
                // +2 other languages
                this.languages = ['Common'];
                this.racialTraits = [{ name: 'Born of Aether', description: 'You have resistance to necrotic damage.' }, { name: 'Menacing', description: 'You gain proficiency in the Intimidation skill.' }, { name: 'Darkvision', description: 'Accustomed to the night, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.' }];
                this.resistances = ['Necrotic'];
                this.size = 'Medium';
                this.skills.intimidation = 2;
                this.speed = 30;
                break;
            default:
                throw 'Your race is not recognized!';
        }
    }
    export() {
        return JSON.stringify(this.toJSON(), null, '\t');
    }
}
