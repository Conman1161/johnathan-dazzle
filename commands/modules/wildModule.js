"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpg_dice_roller_1 = require("rpg-dice-roller");
const d10k_1_2_json_1 = __importDefault(require("../dnd/charts/wild/d10k_1.2.json"));
const d10k_2_0_json_1 = __importDefault(require("../dnd/charts/wild/d10k_2.0.json"));
const _5e_json_1 = __importDefault(require("../dnd/charts/wild/5e.json"));
function getChart(chartName) {
    switch (chartName) {
        case "":
        case undefined:
        case "1.2":
            return d10k_1_2_json_1.default;
        case "2.0":
            return d10k_2_0_json_1.default;
        case "5e":
            return _5e_json_1.default;
    }
    throw 'No chart found!';
}
function getEmbedInfo(chartName, effectNumber) {
    // Assign the name the embed will use
    let chart = getChart(chartName);
    switch (chartName) {
        case "":
        case "1.2":
            if (effectNumber > Object.keys(chart).length)
                throw 'This value is too large for this table!';
            chartName = "The Net Libram of Random Magical Effects 1.2";
            break;
        case "2.0":
            if (effectNumber > Object.keys(chart).length)
                throw 'This value is too large for this table!';
            chartName = "The Net Libram of Random Magical Effects 2.0";
            break;
        case "5e":
            if (effectNumber > Object.keys(chart).length)
                throw 'This value is too large for this table!';
            chartName = "Official Wild Magic Surges";
            break;
    }
    effectNumber = effectNumber === undefined || effectNumber === null ? new rpg_dice_roller_1.DiceRoll(`d${Object.keys(chart).length}`).total : effectNumber;
    // Return {Chart name, Die roll number, Effect from Chart}
    return {
        "name": chartName,
        "effectNumber": effectNumber,
        "text": Object.values(chart)[effectNumber]
    };
}
module.exports = { getChart, getEmbedInfo };
