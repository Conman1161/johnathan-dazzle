# Johnathan Dazzle

Welcome to the repository for Johnathan Dazzle, written by [@Conman1161](https://twitter.com/conman1161)! Dazzle is a Discord bot focused on rolling dice for tabletop RPGs.

# Table of Contents

- [Commands](#Commands)

  - [General](#General)
    - [!help](#!help)
    - [!info](#!info)
    - [!restart](#!restart)
    - [!roll](#!roll)
    - [!rolladv](#!rolladv)
    - [!rollstat](#!rollstat)
    - [!rollstats](#!rollstats)
  
  - [DnD](#DnD)
    - [!modifiers](#!modifiers)
    - [!trinket](#!trinket)
    - [!wild](#!wild)

- [Artwork Credit](#Artwork)

# Commands

- ## General

- ### !help

  - Gives a list of all commands, all commands in a group, or information about a specific command
  
- ### !info

  - Posts a short message with information about Dazzle.
  
- ### !roll

  - Rolls dice based on the arguments you provide. If you don't provide any, a d20 will be rolled. You will also see an array of all the dice you rolled, along with any +/- modifiers you attach in your roll
  
- ### !rolladv

  - Rolls 2d20 for advantage, but can be given a single die and modifiers as well.
    - `die`: The specific die you want to roll advantage for. Only works with single dice (d20, d6, etc.), not (2d20, 1d20, etc.)
    - `modifier`: The modifier you want to apply to a roll. Can be positive or negative (2, -2, etc). If positive, do not put a plus sign.
  
- ### !rollstat

  - Rolls a singular stat by rolling 4d6 and removing the lowest roll.
  
- ### !rollstats

  - Rolls a full stat block by rolling 4d6 and dropping the lowest roll from each set. By default, if the sum of all stats is less than 70, your stat block will be rerolled until the sum of your new stat block is greater than or equal to 70.
    - `full`: Removes the restriction on the sum of all stats. Will give the first stat block it generates, even if the sum is less than 70.
      - `d20`: Rolls 6d20 for your full stat block instead of 6-sets of 4d6.
      - `cth`: Rolls a stat block for Call of Cthulhu.

- ## DnD

- ### !modifiers

  - Posts a list of possible ability score modifiers
  
- ### !trinket

  - Randomly roll on one of 12 trinket charts.
    - `chart`: declare which chart you want to roll on instead of randomly being assigned one.
  
- ### !wild

  - Roll on a wild magic chart for wild magic surges or lookup an effect on a given chart. The default chart is `The Net Libram of Random Magical Effects version 1.20`, which has 10,000 random effects. Can take a Chart Name and Effect Number argument:
    - `Chart Name`: declare which wild magic chart to roll on. The current usable charts can be accessed by using the following argument for their respecitve chart:
      - `1.2`: The Net Libram of Random Magical Effects version 1.20
      - `2.0`: The Net Libram of Random Magical Effects version 2.00
      - `5e`: Official Wild Magic Surges from the DnD 5e Player's Handbook
    - `Effect Number`: declare which effect you would like to lookup. This is mainly for if you or your player roll physical dice when doing wild magic surges.

# Artwork

- All artwork has been commissioned by Kai. Their socials can be found here: [Twitter](https://twitter.com/ckttle_), [Instagram](https://instagram.com/ckttle). Check them out and give them a follow!