const elementTypesToRemove = [
  "extra",
  "library_geometries",
  "library_controllers",
];

type TRemoved = { [key: string]: number };

/**
 * Iterate through the animation elements and remove the following node types:
 * extra
 */
const checkLevelForUnwantedNodes = (
  animationElement: any,
  removed: TRemoved = {}
): TRemoved => {
  Object.keys(animationElement).forEach((key) => {
    if (elementTypesToRemove.indexOf(key) !== -1) {
      delete animationElement[key];
      removed[key] = removed[key] ? removed[key] + 1 : 1;
    } else if (Array.isArray(animationElement[key])) {
      animationElement[key].forEach((element: any) => {
        checkLevelForUnwantedNodes(element, removed);
      });
    } else if (typeof animationElement[key] === "object" && key !== "$") {
      // unusual to find an object here, but it seems "nodes" are treated as objects
      checkLevelForUnwantedNodes(animationElement[key], removed);
    }
  });
  return removed;
};

export const removeUnwantedNodes = (collada: any) => {
  console.log("Check: remove unwanted nodes");
  const removed = checkLevelForUnwantedNodes(collada);
  if (Object.keys(removed).length === 0) {
    console.log("> PASS");
  } else {
    console.log("> FIXED");
    Object.keys(removed).forEach((key) =>
      console.log(`  - removed ${key} (${removed[key]})`)
    );
  }
};
