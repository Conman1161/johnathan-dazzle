const { DiceRoll } = require('rpg-dice-roller');
const chartOneTwo = require("../dnd/charts/wild/d10k_1.2.json");
const chartTwoZero = require("../dnd/charts/wild/d10k_2.0.json");
const chartOfficial = require("../dnd/charts/wild/5e.json");

function getChart(chartName) {
  switch (chartName) {
    case "":
    case undefined:
      return chartOneTwo;
    case "1.2":
      return chartOneTwo;
    case "2.0":
      return chartTwoZero;
    case "5e":
      return chartOfficial;
  }
}

function getEmbedInfo(chartName, effectNumber) {
  // Assign the name the embed will use
  switch (chartName) {
    case "":
    case undefined:
    case "1.2":
      if (effectNumber > getChart(chartName).length) throw 'This value is too large for this table!';
      this.chartName = "The Net Libram of Random Magical Effects 1.2";
      break;
    case "2.0":
      if (effectNumber > getChart(chartName).length) throw 'This value is too large for this table!';
      this.chartName = "The Net Libram of Random Magical Effects 2.0";
      break;
    case "5e":
      if (effectNumber > getChart(chartName).length) throw 'This value is too large for this table!';
      this.chartName = "Official Wild Magic Surges";
      break;
  }
  this.effectNumber = effectNumber == undefined ? new DiceRoll(`d${Object.keys(getChart(chartName)).length}`).total : effectNumber;

  // Return {Chart name, Die roll number, Effect from Chart}
  return {
    "name": this.chartName,
    "effectNumber": this.effectNumber,
    "text": getChart(chartName != '' ? chartName : chartName)[this.effectNumber]
  };
}

module.exports = { getChart, getEmbedInfo };
