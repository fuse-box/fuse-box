import * as sass from 'node-sass';

export function render (content: string, options: any): Promise<string> {
	if (!options) options = {};

	options.data = content;

	return new Promise((resolve, reject) => {
		sass.render(options, (err, res) => {
			return err ? reject(err) : resolve(res.css);
		});
	});
}