fsbx.task("build", () => {
    return this.watch("**/**.js", () => {
        return this.init({ cache: true })
            .bundle("> index.ts")
    });
});