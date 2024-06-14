import fs, { readFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import xml2js from "xml2js";
import { write } from "bun";

// Get the source file path and target file path from command line arguments
const sourceFilePath = process.argv[2];
const targetFilePath = process.argv[3];

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

// Fix 0: avoid spaces in the names
// xml = xml.replace(/Celebration v2/g, "Celebration");

var parser = new xml2js.Parser();
parser.parseString(xml, function (err, result) {
  // Fix 1: merge all the animations together
  // all animation elements under library_animations
  const libraryAnimations = result.COLLADA.library_animations[0].animation;

  const animationElement: { [key: string]: any } = {};
  libraryAnimations.forEach((animation: any) => {
    Object.keys(animation.animation[0]).forEach((key: string) => {
      if (animationElement[key] === undefined) {
        animationElement[key] = [];
      }
      // add the same elements together
      animationElement[key] = [
        ...animationElement[key],
        ...animation.animation[0][key],
      ];
    });
  });
  // DEBUG check the merged count
  // Object.keys(animationElement).forEach((key) => {
  //   console.log(key, animationElement[key].length);
  // });

  result.COLLADA.library_animations[0].animation = [animationElement];

  // Fix 2: avoid spaces in the scene name
  // result.COLLADA.scene[0].instance_visual_scene[0].$.url = "#RootNode";

  var builder = new xml2js.Builder();
  var outputXml = builder.buildObject(result);
  write(outputXml, targetFilePath);
});
