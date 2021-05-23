import { DiceRoll } from 'rpg-dice-roller';
import chartOneTwo from "../dnd/charts/wild/d10k_1.2.json";
import chartTwoZero from "../dnd/charts/wild/d10k_2.0.json";
import chartOfficial from "../dnd/charts/wild/5e.json";

function getChart(chartName: string): object {
  switch (chartName) {
    case "":
    case undefined:
    case "1.2":
      return chartOneTwo;
    case "2.0":
      return chartTwoZero;
    case "5e":
      return chartOfficial;
  }
  throw 'No chart found!';
}

function getEmbedInfo(chartName: string, effectNumber: number) {
  // Assign the name the embed will use
  let chart = getChart(chartName);
  switch (chartName) {
    case "":
    case "1.2":
      if (effectNumber > Object.keys(chart).length) throw 'This value is too large for this table!';
      chartName = "The Net Libram of Random Magical Effects 1.2";
      break;
    case "2.0":
      if (effectNumber > Object.keys(chart).length) throw 'This value is too large for this table!';
      chartName = "The Net Libram of Random Magical Effects 2.0";
      break;
    case "5e":
      if (effectNumber > Object.keys(chart).length) throw 'This value is too large for this table!';
      chartName = "Official Wild Magic Surges";
      break;
  }
  effectNumber = effectNumber === undefined || effectNumber === null ? new DiceRoll(`d${Object.keys(chart).length}`).total : effectNumber;

  // Return {Chart name, Die roll number, Effect from Chart}
  return {
    "name": chartName,
    "effectNumber": effectNumber,
    "text": Object.values(chart)[effectNumber]
  };
}

module.exports = { getChart, getEmbedInfo };
