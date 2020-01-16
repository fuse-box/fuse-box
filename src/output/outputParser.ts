/**
  outputParser is an indepenent enttity that accepts a user string
  e.g "./dist" or "./dist/app.js" or "./dist/app.$hash.js"

  it should return an object which will be used by Bundle objects in order to generate
  contents into the correct folders e.g.

  Bundle
    type : VENDOR
    writer


  output parser can be used to write resources too
*/
export interface IOuputParserProps {
  root: string;
  userString?: string;
  // hashes are enabled for production
  // otherwise they will be stripped from the string even specified
  hashEnabled?: boolean;
  // throw an error if there is a file in the user string
  // e.g. "./dist/app.js" we want to enforce a directory only
  expectDirectory?: boolean;
}

export interface IInitProps {
  // name could be option if there is no name
  // we assume the name is parsed
  name?: string;
  // contents are used to generate hashes on the init step
  // then to write the actual contents
  contents: string;
  // sometimes we need to disable hashes even in production mode
  // for example for writing manifest.json it should be consistent
  // or writing a server entry
  forceDisableHash?: boolean;
}
export function outputParser(props: IOuputParserProps) {
  return {
    init: (opts: IInitProps) => {},
  };
}
