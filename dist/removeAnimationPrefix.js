"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAnimationPrefix = void 0;
const removeAnimationPrefix = (xml) => {
    const animationNaming = xml.match(/<sampler id="([^"]*)mixamorig_Hips/);
    if (animationNaming === null) {
        console.error("Unable to find a <sampler> element with an ID that includes 'mixamorig_Hips'");
        process.exit(1);
    }
    const animationPrefix = animationNaming[1];
    if (animationPrefix.length > 0) {
        console.log(`Found an animation prefix ("${animationPrefix}") - removing`);
        xml = xml.replace(new RegExp(animationPrefix, "g"), "");
    }
    return xml;
};
exports.removeAnimationPrefix = removeAnimationPrefix;
