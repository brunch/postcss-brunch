postcss-brunch
==============

Adds [PostCSS](https://github.com/ai/postcss) support to [brunch](https://github.com/brunch/brunch)


##Install

Add this package to your `package.json` file, then `npm install`.

	{
		"postcss-brunch": "0.1.x"
	}

Or you can `npm install --save postcss-brunch`.

##Add plugins

Add all plugins you want to use with PostCSS in your `package.json` file too. For example, here we add [Autoprefixer](https://github.com/ai/autoprefixer) and [CSS-mqpacker](https://github.com/hail2u/node-css-mqpacker).

	{
		"postcss-brunch": "0.1.x",
		"autoprefixer": ">= 1.1",
		"css-mqpacker": "0.0.3"
	}

Then, configure `postcss-brunch` in your `brunch-config` file, like so:

	plugins:
		postcss:
			plugs:
				'autoprefixer': ['postcss', ['last 8 versions']]
				'css-mqpacker': 'processor'

For each plugins, use a key/value pair:

* `key` must be the name of the module
* `value` can be:
	* a `string` representing the function name which will be called in the module
	* an `array` with the function name at the first index and options at the second

The plugin will write code like this:

	var result = postcss().
				 use(autoprefixer(['last 8 versions'])).postcss).
				 use(mqpacker.processor).
				 process(css).css;

in order to parse CSS only once.

##Note

I don't know if it's a good way of doing things. If you're interested, please let's talk about. :) It'a still a WIP.
