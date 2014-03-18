var postcss = require('postcss');
var PostCSSCompiler;

module.exports = PostCSSCompiler = (function() {

	PostCSSCompiler.prototype.brunchPlugin = true;
	PostCSSCompiler.prototype.type = 'stylesheet';
	PostCSSCompiler.prototype.extension = 'css';

	function PostCSSCompiler(config) {

		// get the plugs to pipe
		var plugs = config.plugins.postcss.plugs || [];

		// initialize the process
		this.pipe = postcss();

		// foreach plugs
		for (var plugName in plugs) {

			// require module by name
			var plug = require(plugName);
			var fn, opts;

			// if option is set to an object, get function and options
			if (typeof plugs[plugName] === 'object') {

				fn = plugs[plugName][0];
				opts = plugs[plugName][1];

			// else, it's only a function name
			} else {

				fn = plugs[plugName];
				opts = null;

			}

			// if module exports a function
			if (typeof plug === 'function') {

				// pipe this function
				this.pipe.use(plug(opts)[fn]);

			} else {

				// simple pipe
				this.pipe.use(plug[fn]);

			}

		}

		null;
	};

	PostCSSCompiler.prototype.compile = function (params, callback) {

		var result = this.pipe.process(params.data).css;
		return callback(null, result);

	};

	PostCSSCompiler.prototype.optimize = function(params, callback) {

		var result = this.pipe.process(params.data).css;
		return callback(null, result);

	};

	return PostCSSCompiler;

})();