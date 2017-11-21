import { loadContentComponent } from "../../../../common/ui/layout";

// this bundle is receiving ALL of the common/ui/layout module split into it,
// even though this isn't the only bundle using it.
export function TestComponent() {
  console.log("I am a test component");
  loadContentComponent();
}
