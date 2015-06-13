var postcss = require('postcss');
var PostCSSCompiler;

module.exports = PostCSSCompiler = (function() {

	PostCSSCompiler.prototype.brunchPlugin = true;
	PostCSSCompiler.prototype.type = 'stylesheet';
	PostCSSCompiler.prototype.extension = 'css';
	PostCSSCompiler.prototype.defaultEnv = '*';

	function PostCSSCompiler(config) {
		this.processors = [];
		if (config.plugins && config.plugins.postcss) {
			if (config.plugins.postcss.processors) {
				this.processors = config.plugins.postcss.processors;
			}
		}
	};

	PostCSSCompiler.prototype.optimize = function(params, callback) {
		var opts = {
			from: params.path,
			to:   params.path,
			map:  {
				inline: false,
				annotation: false
			}
		};
		if (params.map) {
			opts.map.prev = params.map.toJSON();
		}

		postcss(this.processors).process(params.data, opts)
			.then(function (result) {
				result.warnings().forEach(function (warn) {
				    console.warn(warn.toString());
				});
				callback(null, { data: result.css, map: result.map.toJSON() });
			})
			.catch(function (error) {
				if (error.name === 'CssSyntaxError') {
					callback(error.message + error.showSourceCode());
				} else {
					callback(error);
				}
			});
	};

	return PostCSSCompiler;

})();
