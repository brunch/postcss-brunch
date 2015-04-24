postcss-brunch
==============

Adds [PostCSS](https://github.com/ai/postcss) support to [brunch](https://github.com/brunch/brunch)


##Install

Add this package to your `package.json` file, then `npm install`.

	{
		"postcss-brunch": "0.3.x"
	}

Or you can `npm install --save postcss-brunch`.

##Add plugins

Add all plugins you want to use with PostCSS in your `package.json` file too. For example, here we add [Autoprefixer](https://github.com/ai/autoprefixer) and [CSS-mqpacker](https://github.com/hail2u/node-css-mqpacker).

	{
		"postcss-brunch": "0.2.x",
		"autoprefixer": ">= 1.1",
		"css-mqpacker": "0.0.3"
	}

Then, configure `postcss-brunch` in the `plugins` section of your `brunch-config` file, like so:

```javascript
	plugins:
		postcss:
			processors: [
				require('autoprefixer')(['last 8 versions']),
				require('css-mqpacker'),
				require('csswring')
			]
```

You can add as many processors as you want. CSS will be parsed only once. See [PostCSS](https://github.com/ai/postcss) and each plugins docs.

## License

MIT
