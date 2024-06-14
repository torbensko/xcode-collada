"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const xml2js_1 = __importDefault(require("xml2js"));
const lodash_1 = require("lodash");
const stringToXmlObject_1 = require("./stringToXmlObject");
// Get the source file path and target file path from command line arguments
const sourceFilePath = process.argv[process.argv.length - 2];
const targetFilePath = process.argv[process.argv.length - 1];
if (process.argv.length < 2 || !sourceFilePath || !targetFilePath) {
    console.error("Usage: bun run src/index.js <source-file> <target-file>");
    process.exit(1);
}
// Check if the source file exists
if (!(0, fs_1.existsSync)(sourceFilePath)) {
    console.error("Source file does not exist");
    process.exit(1);
}
// Check if the target directory exists
const targetDirectory = path_1.default.dirname(targetFilePath);
if (!(0, fs_1.existsSync)(targetDirectory)) {
    console.error("Target directory does not exist");
    process.exit(1);
}
// Load the contents of the source file
let xml = (0, fs_1.readFileSync)(sourceFilePath, "utf8");
// perform some naming clean up
const nodeNaming = xml.match(/<node id="([^"]*)mixamorig_Hips"/);
if (nodeNaming === null) {
    console.error("Unable to find a <node> element with an ID that includes 'mixamorig_Hips'");
    process.exit(1);
}
const nodePrefix = nodeNaming[1];
if (nodePrefix.length > 0) {
    console.log(`Found a name prefix, "${nodePrefix}" - removing`);
    xml = xml.replace(new RegExp(nodePrefix, "g"), "");
}
const animationNaming = xml.match(/<sampler id="([^"]*)mixamorig_Hips/);
if (animationNaming === null) {
    console.error("Unable to find a <sampler> element with an ID that includes 'mixamorig_Hips'");
    process.exit(1);
}
const animationPrefix = animationNaming[1];
if (animationPrefix.length > 0) {
    console.log(`Found a animation prefix, "${animationPrefix}" - removing`);
    xml = xml.replace(new RegExp(nodePrefix, "g"), "");
}
(async () => {
    const result = await (0, stringToXmlObject_1.stringToXmlObject)(xml);
    const collada = result.COLLADA;
    const libraryAnimations = (0, lodash_1.get)(collada, "library_animations.0");
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
    console.log("Check: ensure no wrapping <animation> element, e.g. <animation><animation>...");
    if (libraryAnimations.animation.length === 1 &&
        libraryAnimations.animation[0].animation) {
        console.log("> FIXED");
        libraryAnimations.animation = libraryAnimations.animation[0].animation;
    }
    else {
        console.log("> PASS");
    }
    console.log("Check: ensure only one <animation> element");
    if (libraryAnimations.animation.length === 0) {
        console.error("No animation element found");
        process.exit(1);
    }
    else if (libraryAnimations.animation.length === 1) {
        console.log("> PASS");
    }
    else {
        console.log("> FIXED - collapsed together");
        const animationElement = {};
        libraryAnimations.animation.forEach((animation) => {
            Object.keys(animation).forEach((key) => {
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
    // remove the armiture node, e.g.
    // <library_visual_scenes>
    //   <visual_scene id="Scene" name="Scene">
    //     <node id="Armature" name="Armature" type="NODE">
    //       <matrix sid="transform">1 0 0 0 0 7.54979e-8 -1 0 0 1 7.54979e-8 0 0 0 0 1</matrix>
    //       <node id="mixamorig_Hips" name="mixamorig:Hips" sid="mixamorig_Hips" type="JOINT">
    //         ...
    //       </node>
    //       <node id="male_ecorche_ZBrushPolyMesh3D" name="male_ecorche:ZBrushPolyMesh3D" type="NODE">
    //         ...
    //       </node>
    //
    // becomes
    //
    // <library_visual_scenes>
    //   <visual_scene id="Scene" name="Scene">
    //     <node id="mixamorig_Hips" name="mixamorig:Hips" sid="mixamorig_Hips" type="JOINT">
    //       ...
    console.log("Check: ensure no wrapping 'Armature' <node> element");
    const topNode = (0, lodash_1.get)(collada, "library_visual_scenes.0.visual_scene.0.node.0");
    if (!topNode) {
        console.error("No top node found");
        process.exit(1);
    }
    else if (topNode.$?.id === "Armature") {
        console.log("> FIXED - removed 'Armature' node");
        const hipsNode = topNode.node.find((node) => node.$.id === "mixamorig_Hips");
        if (!hipsNode) {
            console.error("Unable to find a node with ID 'mixamorig_Hips'");
            process.exit(1);
        }
        collada.library_visual_scenes[0].visual_scene[0].node = hipsNode;
    }
    else if (topNode.$.id === "mixamorig_Hips") {
        console.log("> PASS");
    }
    else {
        console.error("Unexpected top node found");
        process.exit(1);
    }
    /**
     * Iterate through the animation elements and remove the following node types:
     * extra
     */
    const elementTypesToRemove = [
        "extra",
        "library_geometries",
        "library_controllers",
    ];
    console.log("Check: remove unwanted nodes");
    const removeUnwantedNodes = (animationElement, removed = {}) => {
        Object.keys(animationElement).forEach((key) => {
            if (elementTypesToRemove.indexOf(key) !== -1) {
                delete animationElement[key];
                removed[key] = removed[key] ? removed[key] + 1 : 1;
            }
            else if (Array.isArray(animationElement[key])) {
                animationElement[key].forEach((element) => {
                    removeUnwantedNodes(element, removed);
                });
            }
            else if (typeof animationElement[key] === "object" && key !== "$") {
                // unusual to find an object here, but it seems "nodes" are treated as objects
                removeUnwantedNodes(animationElement[key], removed);
            }
        });
        return removed;
    };
    const removed = removeUnwantedNodes(collada);
    if (Object.keys(removed).length === 0) {
        console.log("> PASS");
    }
    else {
        console.log("> FIXED");
        Object.keys(removed).forEach((key) => {
            console.log(`  - removed ${key} (${removed[key]})`);
        });
    }
    console.log("Check: ensure nodes use underscores in the name");
    const fixNodeNames = (animationElement, isNode = false) => {
        let names = [];
        if (isNode && animationElement.$.name.includes(":")) {
            const name = animationElement.$.name.replace(":", "_");
            animationElement.$.name = name;
            names.push(name);
        }
        Object.keys(animationElement).forEach((key) => {
            if (Array.isArray(animationElement[key])) {
                animationElement[key].forEach((element) => {
                    names = [...names, ...fixNodeNames(element, key === "node")];
                });
            }
            else if (typeof animationElement[key] === "object" && key !== "$") {
                // unusual to find an object here, but it seems "nodes" are treated as objects
                names = [
                    ...names,
                    ...fixNodeNames(animationElement[key], key === "node"),
                ];
            }
        });
        return names;
    };
    const nameChanges = fixNodeNames(collada);
    if (nameChanges.length === 0) {
        console.log("> PASS");
    }
    else {
        console.log(`> FIXED - changed ${nameChanges.length} names`);
    }
    const xmlObjectToString = (xmlObject) => {
        var builder = new xml2js_1.default.Builder();
        return builder.buildObject(xmlObject);
    };
    var outputXml = xmlObjectToString(result);
    (0, fs_1.writeFileSync)(targetFilePath, outputXml);
})();
