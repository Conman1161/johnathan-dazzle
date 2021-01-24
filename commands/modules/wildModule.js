const dice = require('dice-expression-evaluator');
const chartOneTwo = require("../dnd/charts/wild/d10k_1.2.json");
const chartTwoZero = require("../dnd/charts/wild/d10k_2.0.json");
const chartOfficial = require("../dnd/charts/wild/5e.json");

function getChart(chartName) {
  switch (chartName) {
    case "":
      return chartOneTwo;
    case "1.2":
      return chartOneTwo;
    case "2.0":
      return chartTwoZero;
    case "5e":
      return chartOfficial;
    default:
      throw 1;
  }
}

function getEmbedInfo(chartName, effectNumber) {
  // Assign the name the embed will use
  switch (chartName) {
    case "1.2":
      this.chartName = "The Net Libram of Random Magical Effects 1.2";
      this.effectNumber = effectNumber == undefined ? dice(`d${Object.keys(getChart(chartName)).length}`).roll().roll : effectNumber;
      break;
    case "2.0":
      this.chartName = "The Net Libram of Random Magical Effects 2.0";
      this.effectNumber = effectNumber == undefined ? dice(`d${Object.keys(getChart(chartName)).length}`).roll().roll : effectNumber;
      break;
    case "5e":
      this.chartName = "Official Wild Magic Surges";
      this.effectNumber = effectNumber == undefined ? dice(`d${Object.keys(getChart(chartName)).length}`).roll().roll : effectNumber;
      break;
    case "":
      this.chartName = "The Net Libram of Random Magical Effects 1.2";
      this.effectNumber = effectNumber == undefined ? dice(`d${Object.keys(getChart(chartName)).length}`).roll().roll : effectNumber;
      break;
    default:
      throw 1;
  }

  // Return {Chart name, Die roll number, Effect from Chart}
  return {
    "name": this.chartName,
    "effectNumber": this.effectNumber,
    "text": getChart(chartName != '' ? chartName : chartName)[this.effectNumber]
  };
}

module.exports = { getChart, getEmbedInfo };
