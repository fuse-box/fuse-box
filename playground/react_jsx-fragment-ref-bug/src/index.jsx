import React from 'react';
import ReactDOM from "react-dom";

import { SectionHeader } from './sectionHeader';

ReactDOM.render(
  <>
    <SectionHeader
      breadcrumbs={[
        { link: "/", text: "Assets" },
        { link: "/", text: "Locations" },
        { link: "/", text: "Helsinki" },
        { link: "/", text: "Temperature" }
      ]}
      header="Location Details"
    />
  </>,
  document.getElementById("root")
);
