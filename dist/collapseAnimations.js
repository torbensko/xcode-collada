"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collapseAnimations = void 0;
function collapseAnimations(libraryAnimations) {
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
}
exports.collapseAnimations = collapseAnimations;
