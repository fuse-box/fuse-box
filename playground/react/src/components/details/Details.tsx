import * as React from "react";

import "./Details.scss";

export function Details() {
  return (
    <div className="Details">
      <div className="repo-link">
        <a href="https://github.com/fuse-box/react-example" target="_blank">
          https://github.com/fuse-box/react-example
        </a>
      </div>

      <div className="try-updating">
        Try changing any of the components, You will get an isntant update
        without a page refresh
      </div>

      <div className="hint">
        Did you know that it doesn't matter how many components you have 5 or
        5000, FuseBox is smart at detecting the changes you make. You will get
        an instant update guaranteed!
      </div>

      <div className="fork">
        Fork this{" "}
        <a href="https://codesandbox.io/s/github/fuse-box/react-example">
          sandbox
        </a>{" "}
        and share the link with your friends and watch you code live!
      </div>
    </div>
  );
}
