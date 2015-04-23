var postcss = require('postcss');
var PostCSSCompiler;

module.exports = PostCSSCompiler = (function() {

	PostCSSCompiler.prototype.brunchPlugin = true;
	PostCSSCompiler.prototype.type = 'stylesheet';
	PostCSSCompiler.prototype.extension = 'css';
	PostCSSCompiler.prototype.pattern = /\.(?:css|scss|sass|less|styl)$/;

	function PostCSSCompiler(config) {
		this.processors = [];
		if (config.plugins && config.plugins.postcss) {
			if (config.plugins.postcss.processors) {
				this.processors = config.plugins.postcss.processors;
			}
		}
	};

	PostCSSCompiler.prototype.compile = function (params, callback) {
		var result = postcss(this.processors).process(params.data).css;
		return callback(null, result);
	};

	PostCSSCompiler.prototype.optimize = function(params, callback) {
		var result = postcss(this.processors).process(params.data).css;
		return callback(null, result);
	};

	return PostCSSCompiler;

})();