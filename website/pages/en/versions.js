const React = require("react");

const CompLibrary = require("../../core/CompLibrary");
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

const CWD = process.cwd();

const siteConfig = require(CWD + "/siteConfig.js");
const versions = require(CWD + "/versions.json");

class Versions extends React.Component {
  render() {
    const latestVersion = versions[0];
    return (
      <div className="docMainWrapper wrapper">
        <Container className="mainContainer versionsContainer">
          <div className="post">
            <header className="postHeader">
              <h2>{siteConfig.title + " Versions"}</h2>
            </header>
            <h3 id="latest">Current version (Stable)</h3>
            <p>Latest version of FuseBox.</p>
            <table className="versions">
              <tbody>
                <tr>
                  <th>{latestVersion}</th>
                  <td>
                    <a href={"/docs/getting-started/installation"}>
                      Documentation
                    </a>
                  </td>
                  <td>
                    <a
                      href={`https://github.com/fuse-box/fuse-box/releases/tag/v${latestVersion}`}
                    >
                      Release Notes
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
            <h3 id="archive">Past Versions</h3>
            <table className="versions">
              <tbody>
                {versions.map(
                  version =>
                    version !== latestVersion && (
                      <tr>
                        <th>{version}</th>
                        <td>
                          <a
                            href={`docs/${version}/getting-started/installation`}
                          >
                            Documentation
                          </a>
                        </td>
                        <td>
                          <a
                            href={`https://github.com/fuse-box/fuse-box/releases/tag/v${version}`}
                          >
                            Release Notes
                          </a>
                        </td>
                      </tr>
                    ),
                )}
              </tbody>
            </table>
            <p>
              You can find past versions of this project{" "}
              <a href="https://github.com/fuse-box/fuse-box/releases">
                on GitHub
              </a>
              .
            </p>
          </div>
        </Container>
      </div>
    );
  }
}

module.exports = Versions;
