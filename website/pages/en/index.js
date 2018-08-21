const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");
const MarkdownBlock = CompLibrary.MarkdownBlock;
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const siteConfig = require(process.cwd() + "/siteConfig.js");

function imgUrl(img) {
  return siteConfig.baseUrl + "img/" + img;
}

function docUrl(doc, language) {
  return siteConfig.baseUrl + "docs/" + (language ? language + "/" : "") + doc;
}

function pageUrl(page, language) {
  return siteConfig.baseUrl + (language ? language + "/" : "") + page;
}

class Button extends React.Component {
  render() {
    return (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={this.props.href} target={this.props.target}>
          {this.props.children}
        </a>
      </div>
    );
  }
}

Button.defaultProps = {
  target: "_self",
};

const SplashContainer = props => (
  <div className="homeContainer">
    <div className="homeSplashFade">
      <div className="wrapper homeWrapper">{props.children}</div>
    </div>
  </div>
);

const Logo = props => (
  <div className="projectLogo">
    <img src={props.img_src} />
  </div>
);

const ProjectTitle = props => (
  <h2 className="projectTitle">
    {siteConfig.title}
    <small>{siteConfig.tagline}</small>
  </h2>
);

const PromoSection = props => (
  <div className="section promoSection">
    <div className="promoRow">
      <div className="pluginRowBlock">{props.children}</div>
    </div>
  </div>
);

class HomeSplash extends React.Component {
  render() {
    let language = this.props.language || "";
    return (
      <SplashContainer>
        <Logo img_src={imgUrl("logo.svg")} />
        <div className="inner">
          <ProjectTitle />
          <PromoSection>
            <Button href="https://github.com/fuse-box/fuse-box">Github</Button>
            <Button href={docUrl("getting-started/installation", language)}>
              Getting started
            </Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

const Feature = props => (
  <div className="feature">
    <div className="feature-icon">
      <i className={`fas fa-${props.icon}`} />
    </div>
    <div className="feature-heading">{props.title}</div>
    <div className="feature-desc checkpoints">
      <MarkdownBlock>{props.desc}</MarkdownBlock>
    </div>
  </div>
);

const codeSplittingDescription = `
* Support ES dynamic imports
* Automatic CSS splitting and optimization
* Tiny API, ~200 bytes
`;

const hotModuleReplacementDescription = `
* Hightly customizable
* Differential updates
* No page reloads
`;

const performanceDescription = `
* Incremental builds and HMR in ~250ms
* Uses TypeScript compiler for JavaScript transpilation, it's faster than Babel!
* Filesystem cache
`;

const typescriptFistDescription = `
 * First class TypeScript support
 * No configuration required
 * Can replace Babel (for js projects)
 * Publish typescript packages to npm
`;

const TypesriptFirst = props => (
  <div className="typescript-first">
    <div className="typescript-logo" />
    <div className="checkpoints">
      <MarkdownBlock>{typescriptFistDescription}</MarkdownBlock>
    </div>
  </div>
);

class Index extends React.Component {
  render() {
    let language = this.props.language || "";

    return (
      <div>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        />
        <HomeSplash language={language} />
        <div className="mainContainer">
          <div className="features">
            <Feature
              icon="laptop-code"
              title="Code splitting"
              desc={codeSplittingDescription}
            />

            <Feature
              icon="bezier-curve"
              title="Hot Module Replacement (HMR)"
              desc={hotModuleReplacementDescription}
            />

            <Feature
              icon="fighter-jet"
              title="Performance"
              desc={performanceDescription}
            />
          </div>
          <TypesriptFirst />

          {/* <LearnHow />
          <TryOut />
          <Description /> */}
        </div>
      </div>
    );
  }
}

module.exports = Index;
