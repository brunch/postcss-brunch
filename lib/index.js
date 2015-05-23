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
		var opts = { from: params.path, to: params.path };
		postcss(this.processors).process(params.data, opts)
			.then(function (result) {
				result.warnings().forEach(function (warn) {
				    process.stderr.write(warn.toString());
				});
				callback(null, result.css);
			})
			.catch(function (error) {
				callback(error);
			});
	};

	return PostCSSCompiler;

})();
