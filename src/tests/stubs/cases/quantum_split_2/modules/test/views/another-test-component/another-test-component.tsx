import { links } from "../../../../common/routes";
import { jwtdecode } from "../../../../common/auth";

export function AnotherTestComponent() {
  console.log("I am another test component");
  console.log("I also reference links", links);
  console.log("and I reference the auth function", jwtdecode());
}
