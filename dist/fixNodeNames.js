"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixNodeNames = void 0;
const checkLevelForNodeNames = (animationElement, isNode = false) => {
    let names = [];
    if (isNode && animationElement.$.name.includes(":")) {
        const name = animationElement.$.name.replace(":", "_");
        animationElement.$.name = name;
        names.push(name);
    }
    Object.keys(animationElement).forEach((key) => {
        if (Array.isArray(animationElement[key])) {
            animationElement[key].forEach((element) => {
                names = [...names, ...checkLevelForNodeNames(element, key === "node")];
            });
        }
        else if (typeof animationElement[key] === "object" && key !== "$") {
            // unusual to find an object here, but it seems "nodes" are treated as objects
            names = [
                ...names,
                ...checkLevelForNodeNames(animationElement[key], key === "node"),
            ];
        }
    });
    return names;
};
const fixNodeNames = (collada) => {
    console.log("Check: ensure nodes use underscores in the name");
    const nameChanges = checkLevelForNodeNames(collada);
    if (nameChanges.length === 0) {
        console.log("> PASS");
    }
    else {
        console.log(`> FIXED - changed ${nameChanges.length} names`);
    }
};
exports.fixNodeNames = fixNodeNames;
