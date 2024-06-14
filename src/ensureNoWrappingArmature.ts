import { get } from "lodash";

/**
 * remove the armiture node. For example:
 *
 * <library_visual_scenes>
 *   <visual_scene id="Scene" name="Scene">
 *     <node id="Armature" name="Armature" type="NODE">
 *       <matrix sid="transform">1 0 0 0 0 7.54979e-8 -1 0 0 1 7.54979e-8 0 0 0 0 1</matrix>
 *       <node id="mixamorig_Hips" name="mixamorig:Hips" sid="mixamorig_Hips" type="JOINT">
 *         ...
 *       </node>
 *       <node id="male_ecorche_ZBrushPolyMesh3D" name="male_ecorche:ZBrushPolyMesh3D" type="NODE">
 *         ...
 *       </node>
 *
 * becomes
 *
 * <library_visual_scenes>
 *   <visual_scene id="Scene" name="Scene">
 *     <node id="mixamorig_Hips" name="mixamorig:Hips" sid="mixamorig_Hips" type="JOINT">
 *       ...
 */
export const ensureNoWrappingArmature = (collada: any) => {
  console.log("Check: ensure no wrapping 'Armature' <node> element");
  const topNode = get(collada, "library_visual_scenes.0.visual_scene.0.node.0");
  if (!topNode) {
    console.error("No top node found");
    process.exit(1);
  } else if (topNode.$?.id === "Armature") {
    console.log("> FIXED - removed 'Armature' node");
    const hipsNode = topNode.node.find(
      (node: any) => node.$.id === "mixamorig_Hips"
    );
    if (!hipsNode) {
      console.error("Unable to find a node with ID 'mixamorig_Hips'");
      process.exit(1);
    }
    collada.library_visual_scenes[0].visual_scene[0].node = hipsNode;
  } else if (topNode.$.id === "mixamorig_Hips") {
    console.log("> PASS");
  } else {
    console.error("Unexpected top node found");
    process.exit(1);
  }
};
