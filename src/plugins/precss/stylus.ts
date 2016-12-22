import * as stylus from 'stylus';

export function render (content: string, options: Object): Promise<string> {
	return new Promise((resolve, reject) => {
		stylus.render(content, options, (err, res) => {
			return err ? reject(err) : resolve(res);
		});
	});
}