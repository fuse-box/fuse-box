
// See https://docusaurus.io/docs/site-config.html for all the possible
// site configuration options.

const siteConfig = {
  baseUrl: "/",
  colors: {
    primaryColor: "#5F5F5F",
    secondaryColor: "#2E55A4",
  },
  cleanUrl: true,
  copyright: "Copyright © " + new Date().getFullYear() + " FuseBox",
  favicon: "img/favicon.png",
  footerIcon: "img/docusaurus.svg",
  headerIcon: "img/docusaurus.svg",
  headerLinks: [
    {
      doc: "getting-started/installation",
      label: "Docs",
    },
  ],
  highlight: {
    theme: "default",
  },
  ogImage: "img/docusaurus.png",
  onPageNav: "separate",
  organizationName: "FuseBox",
  projectName: "fuse-box",
  scripts: ["https://buttons.github.io/buttons.js"],
  tagline: "A bundler that does it right",
  title: "FuseBox",
  twitterImage: "img/docusaurus.png",
  url: "https://fuse-box.org",
};

module.exports = siteConfig;
