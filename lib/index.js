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
				if (result.warnings().length > 0) {
					process.stderr.write("[postcss-brunch] warnings:\n");
					result.warnings().forEach(warn => {
						const line = warn.line ? `line ${this.pad(warn.line, 4)}` : ''
						const col = warn.col ? ` col ${this.pad(warn.col, 3)}` : ''
						process.stderr.write(`\t[${warn.plugin}]:${warn.node ? ' ' + warn.node.toString() : ''}\t${line}${col}: ${warn.text}\n`);
					});
				}
				return {
					path,
					data: result.css,
					map: result.map.toJSON(),
				};
			})
			.catch(error => {
				if (error.name === 'CssSyntaxError') {
					process.stderr.write(`[postcss-brunch] CSS syntax error: \n\t${error.message} ${error.showSourceCode()}\n`);
				} else {
					throw error;
				}
			});
	}
	pad(stringeable, length) {
		return ' '.repeat(length-String(stringeable).length) + String(stringeable);
	}
}

Object.assign(PostCSSCompiler.prototype, {
	brunchPlugin: true,
	type: 'stylesheet',
	extension: 'css',
});

module.exports = PostCSSCompiler;
