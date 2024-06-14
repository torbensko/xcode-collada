const checkLevelForNodeNames = (
  animationElement: any,
  isNode = false
): string[] => {
  let names: string[] = [];
  if (isNode && animationElement.$.name.includes(":")) {
    const name = animationElement.$.name.replace(":", "_");
    animationElement.$.name = name;
    names.push(name);
  }
  Object.keys(animationElement).forEach((key) => {
    if (Array.isArray(animationElement[key])) {
      animationElement[key].forEach((element: any) => {
        names = [...names, ...checkLevelForNodeNames(element, key === "node")];
      });
    } else if (typeof animationElement[key] === "object" && key !== "$") {
      // unusual to find an object here, but it seems "nodes" are treated as objects
      names = [
        ...names,
        ...checkLevelForNodeNames(animationElement[key], key === "node"),
      ];
    }
  });
  return names;
};

export const fixNodeNames = (collada: any) => {
  console.log("Check: ensure nodes use underscores in the name");
  const nameChanges = checkLevelForNodeNames(collada);
  if (nameChanges.length === 0) {
    console.log("> PASS");
  } else {
    console.log(`> FIXED - changed ${nameChanges.length} names`);
  }
};
