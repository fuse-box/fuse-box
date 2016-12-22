import * as less from 'less';

export function render (content: string, options: Object): Promise<string> {
	return new Promise((resolve, reject) => {
		less.render(content, options, (err, res) => {
			return err ? reject(err) : resolve(res.css);
		});
	});
}