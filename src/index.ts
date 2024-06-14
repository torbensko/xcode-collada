import fs, { readFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import xml2js from "xml2js";
import { write } from "bun";
import { get } from "lodash";
import { stringToXmlObject } from "./stringToXmlObject";

// Get the source file path and target file path from command line arguments
const sourceFilePath = process.argv[2];
const targetFilePath = process.argv[3];

if (process.argv.length !== 4 || !sourceFilePath || !targetFilePath) {
  console.error("Usage: bun run src/index.js <source-file> <target-file>");
  process.exit(1);
}

// Check if the source file exists
if (!existsSync(sourceFilePath)) {
  console.error("Source file does not exist");
  process.exit(1);
}

// Check if the target directory exists
const targetDirectory = path.dirname(targetFilePath);
if (!existsSync(targetDirectory)) {
  console.error("Target directory does not exist");
  process.exit(1);
}

// Load the contents of the source file
const xml = readFileSync(sourceFilePath, "utf8");

const result = await stringToXmlObject(xml);

const collada = result.COLLADA;
const libraryAnimations = get(collada, "library_animations.0");

if (!libraryAnimations) {
  console.error("No library_animations found");
  process.exit(1);
}

/**
 * Removes additional parent animation node. For example:
 *
 *  <library_animations>
 *    <animation id="foo" name="Armature">
 *     <animation id="bar" name="Armature">
 *       ...
 *
 * becomes:
 *
 *  <library_animations>
 *    <animation id="bar" name="Armature">
 *      ...
 */
console.log(
  "Check: no wrapping animation element, e.g. <animation><animation>..."
);
if (
  libraryAnimations.animation.length === 1 &&
  libraryAnimations.animation[0].animation
) {
  console.log("> removing wrapping animation element");
  libraryAnimations.animation = libraryAnimations.animation[0].animation;
} else {
  console.log("> PASS");
}

console.log("Check: only one animation element");
if (libraryAnimations.animation.length === 0) {
  console.error("No animation element found");
  process.exit(1);
} else if (libraryAnimations.animation.length === 1) {
  console.log("> PASS");
} else {
  console.log("> collapsing multiple <animation> elements together");

  const animationElement: { [key: string]: any } = {};
  libraryAnimations.animation.forEach((animation: any) => {
    Object.keys(animation).forEach((key: string) => {
      // $ holds the attributes, so we can drop these
      if (key === "$") {
        return;
      }
      if (animationElement[key] === undefined) {
        animationElement[key] = [];
      }
      // add the same elements together
      animationElement[key] = [...animationElement[key], ...animation[key]];
    });
  });
  libraryAnimations.animation = [animationElement];
}

// check if geometry is included
console.log("Check: no geometry included");
if (!collada.library_geometries) {
  console.log("> PASS");
} else {
  console.warn("> removing - please export gemoetry separately");
  delete collada.library_geometries;
}

console.log("Check: no controllers included");
if (!collada.library_controllers) {
  console.log("> PASS");
} else {
  console.warn("> removing");
  delete collada.library_controllers;
}

// DEBUG check the merged count
// Object.keys(animationElement).forEach((key) => {
//   console.log(key, animationElement[key].length);
// });

// Fix 2: avoid spaces in the scene name
// result.COLLADA.scene[0].instance_visual_scene[0].$.url = "#RootNode";

const xmlObjectToString = (xmlObject: any): string => {
  var builder = new xml2js.Builder();
  return builder.buildObject(xmlObject);
};

var outputXml = xmlObjectToString(result);
write(targetFilePath, outputXml);
