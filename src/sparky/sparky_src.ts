import * as glob from 'glob';

export async function sparky_src(rule: string) {
  return new Promise((resolve, reject) => {
    glob(rule, {}, function(err, files) {
      if (err) return reject(err);
      return resolve(files);
    });
  });
}
