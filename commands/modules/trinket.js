const dice = require("dice-expression-evaluator");

const chartOne = require("../dnd/charts/trinket/1.json");
const chartTwo = require("../dnd/charts/trinket/2.json");
const chartThree = require("../dnd/charts/trinket/3.json");
const chartFour = require("../dnd/charts/trinket/4.json");
const chartFive = require("../dnd/charts/trinket/5.json");
const chartSix = require("../dnd/charts/trinket/6.json");
const chartSeven = require("../dnd/charts/trinket/7.json");
const chartEight = require("../dnd/charts/trinket/8.json");
const chartNine = require("../dnd/charts/trinket/9.json");
const chartTen = require("../dnd/charts/trinket/10.json");
const chartEleven = require("../dnd/charts/trinket/11.json");
const chartTwelve = require("../dnd/charts/trinket/12.json");

var allCharts = [
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

function getChartCount() {
  return allCharts.length;
}

function getTrinketNumber(chartNumber) {
  return dice(`d${Object.keys(getChart(chartNumber)).length}`).roll().roll;
}

function getChart(chartNumber) {
  return allCharts[chartNumber - 1];
}

function getTrinketInfo(chartNumber) {
  // Returns [Chart number, trinket text]
  if (chartNumber == "" || chartNumber === undefined) chartNumber = dice(`d${allCharts.length - 1}`).roll().roll;
  if (chartNumber > allCharts.length || chartNumber < 1 || isNaN(chartNumber)) throw 6;

  return [chartNumber, getChart(chartNumber)[getTrinketNumber(chartNumber)]];
}

module.exports = { getTrinketInfo, getChartCount };
