FuseBox.global("__param", function(paramIndex, decorator) {
    return function(target, key) { decorator(target, key, paramIndex); };
});
