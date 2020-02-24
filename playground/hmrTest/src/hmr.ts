export default function(payload, helper) {
  const { appModules, updates } = payload;
  console.log(payload);
  helper.updateModules();
  console.log(appModules);
  if (helper.isStylesheeetUpdate) {
    // console.log(updates[0].content);
    // console.log(payload);
    // for (const item of updates) {
    //   console.log('f;ushing', item.id);
    //   __build_env.cachedModules[item.id] = undefined;
    // }
    // console.log(__build_env.cachedModules);
    helper.flushModules(updates);

    helper.callModules(updates);

    // for (const update of updates) {
    //   new Function(update.content)();
    // }

    // for (const item of updates) __build_env.require(item.id);
  } else {
    helper.flushAll();

    helper.callEntries();
  }
}
