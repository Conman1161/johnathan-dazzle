import { DiceRoll } from 'rpg-dice-roller';

import chartOne from "../dnd/charts/trinket/1.json";
import chartTwo from "../dnd/charts/trinket/2.json";
import chartThree from "../dnd/charts/trinket/3.json";
import chartFour from "../dnd/charts/trinket/4.json";
import chartFive from "../dnd/charts/trinket/5.json";
import chartSix from "../dnd/charts/trinket/6.json";
import chartSeven from "../dnd/charts/trinket/7.json";
import chartEight from "../dnd/charts/trinket/8.json";
import chartNine from "../dnd/charts/trinket/9.json";
import chartTen from "../dnd/charts/trinket/10.json";
import chartEleven from "../dnd/charts/trinket/11.json";
import chartTwelve from "../dnd/charts/trinket/12.json";

let allCharts = [
  chartOne,
  chartTwo,
  chartThree,
  chartFour,
  chartFive,
  chartSix,
  chartSeven,
  chartEight,
  chartNine,
  chartTen,
  chartEleven,
  chartTwelve,
];

export function getChartCount() {
  return allCharts.length;
}

export function getTrinketNumber(chartNumber: number) {
  return new DiceRoll(`d${Object.keys(getChart(chartNumber)).length}`).total;
}

export function getChart(chartNumber: number) {
  return allCharts[chartNumber - 1];
}

export function getTrinketInfo(chartNumber: number): Object {
  // Returns [Chart number, trinket text]
  if (chartNumber === undefined) chartNumber = new DiceRoll(`d${allCharts.length - 1}`).total;
  if (chartNumber > allCharts.length || chartNumber < 1 || isNaN(chartNumber)) throw 6;
  let chart = getChart(chartNumber);
  let trinket = Object.values(chart)[getTrinketNumber(chartNumber)];

  return [chartNumber, trinket];
}

module.exports = { getTrinketInfo, getChartCount };
