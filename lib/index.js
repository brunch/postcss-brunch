var postcss = require('postcss');
var PostCSSCompiler;

module.exports = PostCSSCompiler = (function() {

	PostCSSCompiler.prototype.brunchPlugin = true;
	PostCSSCompiler.prototype.type = 'stylesheet';
	PostCSSCompiler.prototype.extension = 'css';
	PostCSSCompiler.prototype.pattern = /\.(?:css|scss|sass|less|styl)$/;
	PostCSSCompiler.prototype.defaults = {
		config: function (postcss) {
			return postcss();
		}
	}

	function PostCSSCompiler(config) {

		this.config = config;
		var _ref;
		if ((_ref = this.config.plugins) != null) {
			if (_ref.postcss) {
				for(var key in _ref.postcss){
					if(_ref.postcss.hasOwnProperty(key)){
						this.defaults[key] = _ref.postcss[key];
					}
				}
			};
		};
		this.postcssConfig = this.defaults;

	};

	PostCSSCompiler.prototype.compile = function (params, callback) {

		var _ref;
		if (typeof (_ref = this.postcssConfig).config === "function") {
			var result = _ref.config(postcss).process(params.data).css;
			return callback(null, result);
		}

	};

	return PostCSSCompiler;

})();
