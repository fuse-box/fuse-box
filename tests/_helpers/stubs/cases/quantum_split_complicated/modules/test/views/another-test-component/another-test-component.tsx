import { loadContentComponent } from "../../../../common/ui/layout";
import { foo } from "./foo";
export function AnotherTestComponent() {
  console.log("I am another test component", foo() );
  loadContentComponent();
}
