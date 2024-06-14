import { existsSync } from "fs";
import path from "path";

export interface IArguments {
  sourceFilePath: string;
  targetFilePath: string;
}

export const getCommandlineArguments = (): IArguments => {
  if (process.argv.length < 4) {
    console.error("Usage: bun run src/index.js <source-file> <target-file>");
    process.exit(1);
  }

  // Get the source file path and target file path from command line arguments
  const sourceFilePath = process.argv[process.argv.length - 2];
  const targetFilePath = process.argv[process.argv.length - 1];

  // Check if the source file exists
  if (!existsSync(sourceFilePath)) {
    console.error(`Source file does not exist: ${sourceFilePath}`);
    process.exit(1);
  }

  // Check if the target directory exists
  const targetDirectory = path.dirname(targetFilePath);
  if (!existsSync(targetDirectory)) {
    console.error(`Target directory does not exist: ${targetDirectory}`);
    process.exit(1);
  }
  return { sourceFilePath, targetFilePath };
};
