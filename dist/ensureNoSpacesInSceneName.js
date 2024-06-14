"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureNoSpacesInSceneName = void 0;
const ensureNoSpacesInSceneName = (xml) => {
    console.log("Check: ensuring scene name does not include spaces");
    const sceneNameMatch = xml.match(/<visual_scene id="([^"]+)"/);
    if (sceneNameMatch === null) {
        console.error("Unable to find a <visual_scene> element with an ID");
        process.exit(1);
    }
    const sceneName = sceneNameMatch[1];
    if (sceneName.match(" ")) {
        const newSceneName = sceneName.replace(" ", "");
        xml = xml.replace(new RegExp(sceneName, "g"), newSceneName);
        console.log(`> FIXED (replaced ${sceneName} with ${newSceneName})`);
    }
    else {
        console.log("> PASS");
    }
    return xml;
};
exports.ensureNoSpacesInSceneName = ensureNoSpacesInSceneName;
