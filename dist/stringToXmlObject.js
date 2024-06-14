"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringToXmlObject = void 0;
const xml2js_1 = __importDefault(require("xml2js"));
// Fix 0: avoid spaces in the names
// xml = xml.replace(/Celebration v2/g, "Celebration");
const stringToXmlObject = async (xml) => {
    const parser = new xml2js_1.default.Parser();
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.stringToXmlObject = stringToXmlObject;
