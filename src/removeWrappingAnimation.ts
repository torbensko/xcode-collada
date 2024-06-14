/**
 * Removes additional parent animation node. For example:
 *
 *  <library_animations>
 *    <animation id="foo" name="Armature">
 *     <animation id="bar" name="Armature">
 *       ...
 *
 * becomes:
 *
 *  <library_animations>
 *    <animation id="bar" name="Armature">
 *      ...
 */
export const removeWrappingAnimation = (libraryAnimations: any) => {
  console.log(
    "Check: ensure no wrapping <animation> element, e.g. <animation><animation>..."
  );
  if (
    libraryAnimations.animation.length === 1 &&
    libraryAnimations.animation[0].animation
  ) {
    console.log("> FIXED");
    libraryAnimations.animation = libraryAnimations.animation[0].animation;
  } else {
    console.log("> PASS");
  }
};
