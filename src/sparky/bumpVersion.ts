export type IBumpVersionType = 'minor' | 'major' | 'patch' | 'next' | 'alpha' | 'beta' | 'rc' | 'dev';
export interface IBumpVersion {
  userJson?: { version: string };
  type: IBumpVersionType;
}
export function bumpVersion(stringJson: string, opts: IBumpVersion): string {
  let json;

  json = JSON.parse(stringJson);

  let version = json.version || '1.0.0';
  const type = opts.type;

  let matched = version.match(/(\d{1,}).(\d{1,})\.(\d{1,})(-(\w{1,})\.(\d{1,}))?/i);
  let major = matched[1] * 1;
  let minor = matched[2] * 1;
  let patch = matched[3] * 1;
  let addonName = matched[5];
  let addonNumber = matched[6];

  const resetAddon = () => {
    addonName = undefined;
    addonNumber = undefined;
  };
  if (type === 'patch') {
    resetAddon();
    patch++;
  } else if (type === 'minor') {
    minor++;
    patch = 0;
    resetAddon();
  } else if (type === 'major') {
    patch = 0;
    minor = 0;
    resetAddon();
    major++;
  } else {
    if (addonName === type && addonNumber > -1) {
      addonNumber++;
    } else {
      addonName = type;
      addonNumber = 1;
    }
  }
  const base = [`${major}.${minor}.${patch}`];
  if (addonName) {
    base.push(`-${addonName}.${addonNumber}`);
  }
  const finalVersion = base.join('');
  json.version = finalVersion;

  return JSON.stringify(json, null, 2);
}
