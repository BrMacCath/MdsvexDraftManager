"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyNumber = stringifyNumber;
const special = [
    "Zeroth",
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
    "Eleventh",
    "Twelfth",
    "Thirteenth",
    "Fourteenth",
    "Fifteenth",
    "Sixteenth",
    "Seventeenth",
    "Eighteenth",
    "Nineteenth",
];
const deca = [
    "twent",
    "thirt",
    "fort",
    "fift",
    "sixt",
    "sevent",
    "eight",
    "ninet",
];
function stringifyNumber(n) {
    if (n < 20) {
        return special[n];
    }
    if (n % 10 === 0) {
        return deca[Math.floor(n / 10) - 2] + "ieth";
    }
    return deca[Math.floor(n / 10) - 2] + "y-" + special[n % 10];
}
//# sourceMappingURL=stringifyNumber.js.map