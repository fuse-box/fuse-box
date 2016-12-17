
export function testDecorator() {
    return (target: any) => {
        console.log("define");
        Reflect.defineMetadata("resourceType", "component", target);

        console.log(Reflect.getMetadata("fusebox:__filename", target));
        //var filename = Reflect.getMetadata("fusebox:__filename", target, propertyKey);
        //console.log("filename", filename);
    }
}

export function testDecorator2() {
    return (target: any) => {
        console.log("define");
        Reflect.defineMetadata("resourceType", "component", target);

        console.log(Reflect.getMetadata("fusebox:__filename", target));
        //var filename = Reflect.getMetadata("fusebox:__filename", target, propertyKey);
        //console.log("filename", filename);
    }
}