'use strict';
const postcss = require('postcss');
const progeny = require('progeny');
const logger = require('loggy');

class PostCSSCompiler {
	constructor(config) {
		const postcss = config.plugins.postcss;
		this.processors = postcss && postcss.processors || [];
		const rootPath = config.paths.root;
		this.getDependencies = progeny({rootPath, reverseArgs: true});
	}

	compile(file) {
		const path = file.path;
		const opts = {
			from: path,
			to: path,
			map: {
				inline: false,
				annotation: false,
				sourcesContent: false,
			},
		};

		if (file.map) {
			opts.map.prev = file.map.toJSON();
		}

		return postcss(this.processors).process(file.data, opts)
			.then(result => {
				result.warnings().forEach(warn => {
					logger.warn(warn);
				});

				return {
					path,
					data: result.css,
					map: result.map.toJSON(),
				};
			})
			.catch(error => {
				if (error.name === 'CssSyntaxError') {
					throw error.message + error.showSourceCode();
				}
				throw error;
			});
	}
}

Object.assign(PostCSSCompiler.prototype, {
	brunchPlugin: true,
	type: 'stylesheet',
	extension: 'css',
});

module.exports = PostCSSCompiler;

