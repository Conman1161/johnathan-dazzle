"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpg_dice_roller_1 = require("rpg-dice-roller");
const _1_json_1 = __importDefault(require("../dnd/charts/trinket/1.json"));
const _2_json_1 = __importDefault(require("../dnd/charts/trinket/2.json"));
const _3_json_1 = __importDefault(require("../dnd/charts/trinket/3.json"));
const _4_json_1 = __importDefault(require("../dnd/charts/trinket/4.json"));
const _5_json_1 = __importDefault(require("../dnd/charts/trinket/5.json"));
const _6_json_1 = __importDefault(require("../dnd/charts/trinket/6.json"));
const _7_json_1 = __importDefault(require("../dnd/charts/trinket/7.json"));
const _8_json_1 = __importDefault(require("../dnd/charts/trinket/8.json"));
const _9_json_1 = __importDefault(require("../dnd/charts/trinket/9.json"));
const _10_json_1 = __importDefault(require("../dnd/charts/trinket/10.json"));
const _11_json_1 = __importDefault(require("../dnd/charts/trinket/11.json"));
const _12_json_1 = __importDefault(require("../dnd/charts/trinket/12.json"));
let allCharts = [
    _1_json_1.default,
    _2_json_1.default,
    _3_json_1.default,
    _4_json_1.default,
    _5_json_1.default,
    _6_json_1.default,
    _7_json_1.default,
    _8_json_1.default,
    _9_json_1.default,
    _10_json_1.default,
    _11_json_1.default,
    _12_json_1.default,
];
function getChartCount() {
    return allCharts.length;
}
function getTrinketNumber(chartNumber) {
    return new rpg_dice_roller_1.DiceRoll(`d${Object.keys(getChart(chartNumber)).length}`).total;
}
function getChart(chartNumber) {
    return allCharts[chartNumber - 1];
}
function getTrinketInfo(chartNumber) {
    // Returns [Chart number, trinket text]
    if (chartNumber === undefined)
        chartNumber = new rpg_dice_roller_1.DiceRoll(`d${allCharts.length - 1}`).total;
    if (chartNumber > allCharts.length || chartNumber < 1 || isNaN(chartNumber))
        throw 6;
    let chart = getChart(chartNumber);
    let trinket = Object.values(chart)[getTrinketNumber(chartNumber)];
    return [chartNumber, trinket];
}
module.exports = { getTrinketInfo, getChartCount };
