import { compileModule } from "../program/compileModule";

const result = compileModule({
  code: `
      import stuff from "./stuff"
      class FirstClass {
        constructor(public name : string){
          console.log(FirstClass_hey);

          class SubClass {
            constructor(public name : string){
              console.log(SubClass_hey);
            }
          }
        }
      }

    `
});
console.log(result.code);
