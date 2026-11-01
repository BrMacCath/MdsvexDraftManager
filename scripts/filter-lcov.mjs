import fs from "node:fs";

const file = "coverage/lcov.info";
const records = fs.readFileSync(file, "utf8").split("end_of_record\n");
const kept = records.filter(r => r.trim() && !/^SF:.*node_modules/m.test(r));
fs.writeFileSync(file, kept.map(r => r + "end_of_record\n").join(""));