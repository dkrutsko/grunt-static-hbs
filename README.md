# Static HBS
[![Build Status](https://travis-ci.org/dkrutsko/grunt-static-hbs.png)](https://travis-ci.org/dkrutsko/grunt-static-hbs)
[![NPM version](https://badge.fury.io/js/grunt-static-hbs.png)](https://badge.fury.io/js/grunt-static-hbs)

<p align="justify">A simple plugin for <a href="http://gruntjs.com">Grunt</a> which compiles <a href="http://handlebarsjs.com">handlebars</a> templates into static html files. It works by using <a href="https://github.com/donpark/hbs">hbs</a> to compile and render the templates, allowing us to seamlessly transition from using <a href="https://github.com/visionmedia/express">express</a> to using Grunt instead. By using hbs, we get the advantage of having both the power of handlebars and the power of hbs specific extensions. Because hbs is an express library, this plugin simulates an express rendering call on each of the files in order to compile the templates.</p>

### Installation
<p align="justify">This plugin requires <a href="http://gruntjs.com">Grunt</a> 0.4.x which uses <a href="http://nodejs.org">Node.js</a>. If you haven't used Grunt before, be sure to check out the <a href="http://gruntjs.com/getting-started">Getting Started</a> guide, as it explains how to create a <a href="http://gruntjs.com/sample-gruntfile">Gruntfile</a> as well as install and use Grunt plugins. Once you're familiar with that process you may install this plugin with the following command:</p>

```shell
$ npm install grunt-static-hbs
```

<p align="justify">Once the plugin has been installed, it may be enabled inside your Gruntfile using the following:</p>

```js
grunt.loadNpmTasks ("grunt-static-hbs");
```

### Quick Start
```js
"hbs":
{
	target1:
	{
		options:
		{
			layout: "path/to/layout.html",

			helpers:
			{
				"helper1": "path/to/helper.js",
				"helper2": function (...) { }
			},

			partials:
			{
				"partial1": "path/to/partial.html",
				"partial2": "some inline partial"
			}
		},

		files:
		{
			"result1.html": "path/to/source.html",

			"result2.html":
			{
				 source: "path/to/source.html",
				 layout: "path/to/layout.html",
				context: "path/to/context.json"
			},

			"result3.html":
			{
				 source: "path/to/source.html",
				context: { some: "context" }
			}
		}
	},

	target2:
	{
		...
	}
}
```

### Documentation
#### Options
* **layout** An optional path to your layout file.
* **helpers** An optional object containing helpers specified as a path to a module exposing a function or a function.
* **partials** An optional object containing partials specified as a path to a partial or a string representing a partial.

#### Files
```js
"path/to/result.html": "path/to/source.html"
```
* **source** A path to your input file. Attempts to use *"path/to/source.json"* as a context.

```js
"path/to/result.html": { additional options }
```
* **source** A path to your input file.
* **layout** An optional path to your layout file, overriding layout specified in options.
* **context** An optional context, either as a path to a json file or an inline object.

### Author
* Email: <dave@krutsko.net>
* Home: [dave.krutsko.net](http://dave.krutsko.net)
* GitHub: [github.com/dkrutsko](https://github.com/dkrutsko)