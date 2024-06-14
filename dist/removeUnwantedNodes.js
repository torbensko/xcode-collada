"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUnwantedNodes = void 0;
const elementTypesToRemove = [
    "extra",
    "library_geometries",
    "library_controllers",
];
/**
 * Iterate through the animation elements and remove the following node types:
 * extra
 */
const checkLevelForUnwantedNodes = (animationElement, removed = {}) => {
    Object.keys(animationElement).forEach((key) => {
        if (elementTypesToRemove.indexOf(key) !== -1) {
            delete animationElement[key];
            removed[key] = removed[key] ? removed[key] + 1 : 1;
        }
        else if (Array.isArray(animationElement[key])) {
            animationElement[key].forEach((element) => {
                checkLevelForUnwantedNodes(element, removed);
            });
        }
        else if (typeof animationElement[key] === "object" && key !== "$") {
            // unusual to find an object here, but it seems "nodes" are treated as objects
            checkLevelForUnwantedNodes(animationElement[key], removed);
        }
    });
    return removed;
};
const removeUnwantedNodes = (collada) => {
    console.log("Check: remove unwanted nodes");
    const removed = checkLevelForUnwantedNodes(collada);
    if (Object.keys(removed).length === 0) {
        console.log("> PASS");
    }
    else {
        console.log("> FIXED");
        Object.keys(removed).forEach((key) => console.log(`  - removed ${key} (${removed[key]})`));
    }
};
exports.removeUnwantedNodes = removeUnwantedNodes;
