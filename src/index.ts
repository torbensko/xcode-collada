import { writeFileSync, readFileSync } from "fs";
import xml2js from "xml2js";
import { get } from "lodash";

import { getCommandlineArguments } from "./getCommandlineArguments";
import { stringToXmlObject } from "./stringToXmlObject";
import { ensureNoSpacesInSceneName } from "./ensureNoSpacesInSceneName";
import { removeAnimationPrefix } from "./removeAnimationPrefix";
import { removeNodePrefix } from "./removeNodePrefix";
import { removeWrappingAnimation } from "./removeWrappingAnimation";
import { collapseAnimations } from "./collapseAnimations";
import { ensureNoWrappingArmature } from "./ensureNoWrappingArmature";
import { removeUnwantedNodes } from "./removeUnwantedNodes";
import { fixNodeNames } from "./fixNodeNames";

const { sourceFilePath, targetFilePath } = getCommandlineArguments();

// Load the contents of the source file
let xml = readFileSync(sourceFilePath, "utf8");

xml = removeNodePrefix(xml);
xml = removeAnimationPrefix(xml);
xml = ensureNoSpacesInSceneName(xml);

(async () => {
  const result = await stringToXmlObject(xml);

  const collada = result.COLLADA;
  if (!collada) {
    console.error("No COLLADA element found");
    process.exit(1);
  }
  const libraryAnimations = get(collada, "library_animations.0");
  if (!libraryAnimations) {
    console.error("No library_animations found");
    process.exit(1);
  }

  removeWrappingAnimation(libraryAnimations);
  collapseAnimations(libraryAnimations);
  ensureNoWrappingArmature(collada);
  fixNodeNames(collada);
  removeUnwantedNodes(collada);

  const xmlObjectToString = (xmlObject: any): string => {
    var builder = new xml2js.Builder();
    return builder.buildObject(xmlObject);
  };

  var outputXml = xmlObjectToString(result);
  writeFileSync(targetFilePath, outputXml);
})();
