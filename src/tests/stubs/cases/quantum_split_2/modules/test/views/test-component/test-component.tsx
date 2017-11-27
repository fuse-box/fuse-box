import { links } from "../../../../common/routes";

// this bundle is receiving ALL of the common/ui/layout module split into it,
// even though this isn't the only bundle using it.
export function TestComponent() {
  console.log("I am a test component");
  console.log("here are my links", links);
}
