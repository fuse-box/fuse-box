
export function testDecorator() {
    console.log("testDecorator(): evaluated");
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        var filename = Reflect.getMetadata("fusebox:__filename", target, propertyKey);
        console.log("filename", filename);
    }
}