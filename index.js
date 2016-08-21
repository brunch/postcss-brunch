'use strict';
const postcss = require('postcss');
const progeny = require('progeny');
const logger = require('loggy');

const defaultMapper = {
	inline: false,
	annotation: false,
	sourcesContent: false,
};

class PostCSSCompiler {
	constructor(config) {
		const rootPath = config.paths.root;
		const cfg = config.plugins.postcss;
		this.config = cfg || {};
		const proc = cfg && cfg.processors || [];
		this.map = this.config.map ?
			Object.assign({}, defaultMapper, this.config.map) :
			defaultMapper;
		this.getDependencies = progeny({rootPath, reverseArgs: true});
		this.processor = postcss(proc);
	}

	compile(file) {
		const path = file.path;
		const opts = {from: path, to: path, map: this.map};

		if (file.map) {
			opts.map.prev = file.map.toJSON();
		}

		return this.processor.process(file.data, opts).then(result => {
			result.warnings().forEach(warn => logger.warn(warn));

			return {
				path,
				data: result.css,
				map: result.map.toJSON(),
			};
		}).catch(error => {
			if (error.name === 'CssSyntaxError') {
				throw new Error(error.message + error.showSourceCode());
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

