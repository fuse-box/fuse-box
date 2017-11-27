export const anotherTestRoute = {
  component: () => import("../views/another-test-component"),
  moreComponents: [() => import("../views/test-component-header")]
};
