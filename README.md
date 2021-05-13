# Johnathan Dazzle

Welcome to the repository for Johnathan Dazzle, written by [@Conman1161](https://twitter.com/conman1161)! Dazzle is a Discord bot focused on rolling dice for tabletop RPGs.

You can join the support server, which has the bot invite link, [here](https://discord.gg/ZUJAMnh)

## Table of Contents

- [Future Ideas to Implement](#feature-ideas)

- [Commands](#Commands)

  - [Dice](#Dice)
    - [Average](#Average)
    - [Max](#Max)
    - [Min](#Min)
    - [Roll](#Roll)
    - [Rollstats](#Rollstats)

  - [DnD](#DnD)
    - [Deck of Many Things](#Deck%20of%20Many%20Things)
    - [Modifiers](#modifiers)
    - [Trinket](#trinket)
    - [Wild](#wild)

  - [General](#General)
    - [Help](#help)
    - [Info](#info)
    - [Restart](#restart)
    - [Support](#support)

- [Artwork Credit](#Artwork)

## Feature Ideas

- These are not guaranteed to be added and simply act as a list of possible ideas that have potential to be added

- [ ] Character Sheets
  - [ ] Statblock
  - [ ] Token
    - [ ] Return original portrait
    - [ ] ? Transparent image to go overtop uploaded portrait
  - [ ] Current HP
  - [ ] Level/XP
    - [ ] Feature Tracking
    - [ ] ? Multiclassing
  - [ ] Ability Checks
  - [ ] Skill Checks
  - [ ] Saving Throws
  - [ ] Switch between default characters
  - [ ] ? Import Character Sheet from websites (G.Sheet/D&D Beyond)
  - [ ] ? Export Sheet as PDF
  - [ ] ? Inventory
- [ ] Random Character at Given/Random (low) level
- [ ] Lookup rules
  - [ ] Backgrounds
  - [ ] Class
  - [ ] Feat
  - [ ] Condition/Status
  - [ ] Item
  - [ ] Monster
  - [ ] Race
  - [ ] Spell
  - [ ] Subclass
- [ ] ? Spell Lists

## Commands

      Command Format

      - Command Category
        - Command Name
        - Command Description
        
        - Subcommand?
          - Options?: Option Desscription?
            - Choices?: Choice Description? 
          
        - Options?: Option Desscription?
          - Choices?: Choice Description?

- ### Dice

    - ### Average

      - Get the average roll of a given dice expression
    - ### Max

      - Get the maximum possible roll of a given dice expression

   - ### Min

        - Get the lowest possible roll of a given dice expression

   - ### Roll

      - Rolls a d20
      - `dice`: A valid dice expression

  - ### Rollstats
  
    -  Rolls 4d6 for each ability score
    - `modifier`: An alternative rolling style
      - `6d20`: Rolls 6d20 for your ability scores instead of 6 sets of 4d6
      - `70 Minimum`: Will only provide a standard statblock if the sum of all ability scores is greater than or equal to 70
      - `Call of Cthulhu`: Rolls a statblock according to the Call of Cthulhu ruleset
  
- ### DnD

  - ### Deck of Many Things

    - `draw`: Draw a card from the Deck of Many Things
      - `13 Card Deck`: Draw from the deck with 13 cards
      - `22 Card Deck`: Draw from the deck with 22 cards
    - `lookup`: Lookup one of the cards from the Deck of Many Things
      - `card`: The card you are searching for. Selection of all cards from the 22 Card Deck

  - ### Modifiers

    - Get a list of all valid ability scores and their modifier
  
  - ### Trinket

    - Get a random trinket from 1 of 12 charts
    - `chart`: Select which chart you want your trinket to be from. 12 charts are selectable

  - ### Wild

    - `lookup`: Lookup an effect on one of the charts
      - `chart`: The chart your effect is from
      - `effect_number`: The number of the effect
    - `roll`: Roll on one of the wild magic charts
      - `chart`: The chart you wish to roll on
        - `D&D 5e`: The official wild magic chart from the D&D 5e SRD
        - `Net Libram 1.2`: The Net Libram of Random Magical Effects version 1.2 by Orrex
        - `Net Libram 2.0`: The Net Libram of Random Magical Effects version 2.0 by Orrex
  
- ### General
  
  - ### Help
    - Get a list of commands in their respective categories. Hovering over them will show their descriptions
    - `command`: Provide a specific command you want to see more information about

  - ### Info
    - Get some information about Dazzle.

  - ### Restart
    - Restart Dazzle. Only works if you are the bot owner and have setup that in config.json

  - ### Support
    - Get a link to the Johnathan Dazzle Support Server

## Artwork

- All artwork has been commissioned by Kai. Their socials can be found here: [Twitter](https://twitter.com/ckttle_), [Instagram](https://instagram.com/ckttle). Check them out and give them a follow!
