'use strict';
const sysPath = require('path');
const postcss = require('postcss');
const postcssModules = require('postcss-modules');
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

const cssModulify = (path, data, map, options) => {
	let json = {};
	const getJSON = (_, _json) => json = _json;

	return postcss([postcssModules(Object.assign({}, {getJSON}, options))])
		.process(data, {from: path, map}).then(x => {
			const exports = 'module.exports = ' + JSON.stringify(json) + ';';
			return { data: x.css, map: x.map, exports };
		});
};

class PostCSSCompiler {
	constructor(config) {
		this.config = config.plugins.postcss || {};
		this.map = this.config.map ?
			Object.assign({}, defaultMapper, this.config.map) :
			defaultMapper;

		const rootPath = config.paths.root;
		const progenyOpts = Object.assign({rootPath, reverseArgs: true},
			this.config.progeny);
		this.getDependencies = progeny(progenyOpts);

		const proc = this.config.processors || [];
		this.processor = postcss(proc);

		this.modules = this.config.modules;
		this.other = this.config.other;
		this.extension = this.config.extension || 'css';
	}

	compile(file) {
		const path = file.path;
		const opts = Object.assign({from: path, to: sysPath.basename(path),
			map: this.map}, this.other);

		if (file.data === undefined) {
			file.data = '';
		}
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

			if (this.modules) {
				const moduleOptions = this.modules === true ? {} : this.modules;
				return cssModulify(path, result.css, mapping, moduleOptions);
			} else {
				return {
					path,
					data: result.css,
					map: mapping,
				};
			}
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
	type: 'stylesheet'
});

module.exports = PostCSSCompiler;
