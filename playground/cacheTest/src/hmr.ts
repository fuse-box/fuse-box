export default function(payload, hmr) {
  const { updates } = payload;
  console.log(payload);
  hmr.updateModules();
  if (hmr.isStylesheeetUpdate) {
    hmr.flushModules(updates);
    hmr.callModules(updates);
  } else {
    hmr.flushAll();
    hmr.callEntries();
  }
}
