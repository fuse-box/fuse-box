const React = require("react");

class Footer extends React.Component {
  docUrl(doc) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + "docs/" + doc;
  }

  pageUrl(doc) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
                width="66"
                height="58"
              />
            )}
          </a>
          <div>
            <h5>Docs</h5>
            <a href={this.docUrl("getting-started/installation")}>
              Getting Started
            </a>
            <a href={this.docUrl("development/configuration")}>Development</a>
            <a href={this.docUrl("production-builds/quantum")}>
              Production Builds
            </a>
            <a href={this.docUrl("task-runner/getting-started-with-sparky")}>
              Task Runner
            </a>
            <a href={this.docUrl("test-runner/test-runner")}>Test Runner</a>
            <a href={this.docUrl("guides/working-with-targets")}>Guides</a>
            <a href={this.docUrl("plugins/babel-plugin")}>Plugins</a>
          </div>
          <div>
            <h5>Community</h5>
            <a href="https://gitter.im/fusebox-bundler/Lobby">Gitter</a>
            <a
              href="https://twitter.com/fuseboxjs"
              target="_blank"
              rel="noreferrer noopener"
            >
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/fuse-box/fuse-box">GitHub</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
