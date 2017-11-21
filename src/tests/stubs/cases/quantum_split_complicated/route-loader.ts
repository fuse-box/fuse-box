import { testRoute, anotherTestRoute } from "./modules/test/routes";
import { loadHeaderComponent as shouldBreak } from "./common/ui/layout";

// this function is referenced in our split bundles too.
// for some reason, the first split bundle is receiving ALL of
// the common bundle files
shouldBreak();

// this would get loaded into the router
const routeLoader = [testRoute, anotherTestRoute];

// mock router call
export async function loadRoute() {
  routeLoader.forEach(r => {
    runRoute(r);
  });
}

async function runRoute(r: typeof testRoute) {
  const component = await r.component();
  component();

  const components = await Promise.all(r.moreComponents.map(r => r()));
  components.forEach(c => c());
}
