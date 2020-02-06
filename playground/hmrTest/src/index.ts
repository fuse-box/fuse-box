import "./index.scss";

async function main(){
    const foo = await import("./components/FooComponent")
    const bar = await import("./components/BarComponent");

    document.getElementById("root").innerHTML = `
        <div class="foo">${foo.default}</div>
        <div class="bar">${bar.default}</div>
    `
}


main();