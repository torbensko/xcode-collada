"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const xml2js_1 = __importDefault(require("xml2js"));
const lodash_1 = require("lodash");
const getCommandlineArguments_1 = require("./getCommandlineArguments");
const stringToXmlObject_1 = require("./stringToXmlObject");
const ensureNoSpacesInSceneName_1 = require("./ensureNoSpacesInSceneName");
const removeAnimationPrefix_1 = require("./removeAnimationPrefix");
const removeNodePrefix_1 = require("./removeNodePrefix");
const removeWrappingAnimation_1 = require("./removeWrappingAnimation");
const collapseAnimations_1 = require("./collapseAnimations");
const ensureNoWrappingArmature_1 = require("./ensureNoWrappingArmature");
const removeUnwantedNodes_1 = require("./removeUnwantedNodes");
const fixNodeNames_1 = require("./fixNodeNames");
const { sourceFilePath, targetFilePath } = (0, getCommandlineArguments_1.getCommandlineArguments)();
// Load the contents of the source file
let xml = (0, fs_1.readFileSync)(sourceFilePath, "utf8");
xml = (0, removeNodePrefix_1.removeNodePrefix)(xml);
xml = (0, removeAnimationPrefix_1.removeAnimationPrefix)(xml);
xml = (0, ensureNoSpacesInSceneName_1.ensureNoSpacesInSceneName)(xml);
(async () => {
    const result = await (0, stringToXmlObject_1.stringToXmlObject)(xml);
    const collada = result.COLLADA;
    if (!collada) {
        console.error("No COLLADA element found");
        process.exit(1);
    }
    const libraryAnimations = (0, lodash_1.get)(collada, "library_animations.0");
    if (!libraryAnimations) {
        console.error("No library_animations found");
        process.exit(1);
    }
    (0, removeWrappingAnimation_1.removeWrappingAnimation)(libraryAnimations);
    (0, collapseAnimations_1.collapseAnimations)(libraryAnimations);
    (0, ensureNoWrappingArmature_1.ensureNoWrappingArmature)(collada);
    (0, fixNodeNames_1.fixNodeNames)(collada);
    (0, removeUnwantedNodes_1.removeUnwantedNodes)(collada);
    const xmlObjectToString = (xmlObject) => {
        var builder = new xml2js_1.default.Builder();
        return builder.buildObject(xmlObject);
    };
    var outputXml = xmlObjectToString(result);
    (0, fs_1.writeFileSync)(targetFilePath, outputXml);
})();
