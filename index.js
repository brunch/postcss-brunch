'use strict';
const sysPath = require('path');
const postcss = require('postcss');
const progeny = require('progeny');
const logger = require('loggy');

const defaultMapper = {
	inline: false,
	annotation: false,
	sourcesContent: false,
};

const pad = (stringeable, length) => {
	return ' '.repeat(length - String(stringeable).length) + String(stringeable);
};

const notify = (warnings) => {
	if (!warnings.length) return;
	const str = warnings.map(warn => {
		const line = warn.line ? `line ${pad(warn.line, 4)}` : ''
		const col = warn.col ? ` col ${pad(warn.col, 3)}` : ''
		const node = warn.node ? ' ' + warn.node.toString() : '';
		return `\t[${warn.plugin}]:${node}\t${line}${col}: ${warn.text}\n`;
	}).join('\n');
	logger.warn(`postcss-brunch: ${str}`);
}

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
		console.log(111, path);
		const opts = {from: path, to: sysPath.basename(path), map: this.map};

		if (file.map) {
			opts.map.prev = file.map.toJSON();
		}

		return this.processor.process(file.data, opts).then(result => {
			notify(result.warnings());

			const mapping = result.map.toJSON();
			// Not sure why postcss gives the basename instead of the full path;
			// TODO: investigate.
			// For now, "the solution":
			const src = mapping.sources;
			if (src && src.length === 1 && src[0] === sysPath.basename(path)) {
				src[0] = path;
			}

			return {
				path,
				data: result.css,
				map: mapping,
			};
		}).catch(error => {
			if (error.name === 'CssSyntaxError') {
				throw new Error('postcss-brunch syntax error: ' + error.message + error.showSourceCode());
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

