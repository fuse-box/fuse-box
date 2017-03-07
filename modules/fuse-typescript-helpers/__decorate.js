FuseBox.global("__fsbx_decorate", function(localArguments) {
    return function(decorators, target, key, desc) {
        var c = arguments.length,
            r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
            d;

        if (!decorators) {
            return;
        }
        if (decorators && decorators.push) {
            decorators.push(
                __metadata("fusebox:exports", localArguments[0]),
                __metadata("fusebox:require", localArguments[1]),
                __metadata("fusebox:module", localArguments[2]),
                __metadata("fusebox:__filename", localArguments[3]),
                __metadata("fusebox:__dirname", localArguments[4])
            );
        }
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
});

FuseBox.global("__metadata", function(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
});
