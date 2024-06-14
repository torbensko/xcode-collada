export const removeNodePrefix = (xml: string): string => {
  // perform naming clean up across the entire file
  const nodeNaming = xml.match(/<node id="([^"]*)mixamorig_Hips"/);
  if (nodeNaming === null) {
    console.error(
      "Unable to find a <node> element with an ID that includes 'mixamorig_Hips'"
    );
    process.exit(1);
  }
  const nodePrefix = nodeNaming[1];
  if (nodePrefix.length > 0) {
    console.log(`Found a name prefix ("${nodePrefix}") - removing`);
    xml = xml.replace(new RegExp(nodePrefix, "g"), "");
  }
  return xml;
};
