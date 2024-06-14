"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCommandlineArguments = void 0;
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const getCommandlineArguments = () => {
    if (process.argv.length < 4) {
        console.error("Usage: bun run src/index.js <source-file> <target-file>");
        process.exit(1);
    }
    // Get the source file path and target file path from command line arguments
    const sourceFilePath = process.argv[process.argv.length - 2];
    const targetFilePath = process.argv[process.argv.length - 1];
    // Check if the source file exists
    if (!(0, fs_1.existsSync)(sourceFilePath)) {
        console.error(`Source file does not exist: ${sourceFilePath}`);
        process.exit(1);
    }
    // Check if the target directory exists
    const targetDirectory = path_1.default.dirname(targetFilePath);
    if (!(0, fs_1.existsSync)(targetDirectory)) {
        console.error(`Target directory does not exist: ${targetDirectory}`);
        process.exit(1);
    }
    return { sourceFilePath, targetFilePath };
};
exports.getCommandlineArguments = getCommandlineArguments;
