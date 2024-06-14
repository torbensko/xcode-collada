export const ensureNoSpacesInSceneName = (xml: string): string => {
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
  } else {
    console.log("> PASS");
  }
  return xml;
};
