////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                        (C) 2013-2016  David Krutsko                        //
//                        See LICENSE.md for copyright                        //
//                                                                            //
// -------------------------------------------------------------------------- //
////////////////////////////////////////////////////////////////////////////////

"use strict";

//----------------------------------------------------------------------------//
// Application                                                                //
//----------------------------------------------------------------------------//

////////////////////////////////////////////////////////////////////////////////
/// Represents the main grunt application exposed through the exports module.

function gruntApp (grunt)
{
	//----------------------------------------------------------------------------//
	// Includes                                                                   //
	//----------------------------------------------------------------------------//

	var hbs   = require ("hbs"  );
	var async = require ("async");
	var path  = require ("path" );



	//----------------------------------------------------------------------------//
	// Grunt Main                                                                 //
	//----------------------------------------------------------------------------//

	grunt.registerMultiTask ("hbs",
	"Compile hbs templates into " +
	"static html files", function()
	{
		// Asynchronous signal
		var done = this.async();

		// Retrieve list of options
		var options = this.options
		({
			layout   : "",
			helpers  : { },
			partials : { }
		});

		// Expand options
		expand (options);

		// Retrieve the list of files
		var files = this.data.files;
		var k = Object.keys (files);

		// Iterate all files asynchronously
		async.each (k, function (i, callback)
		{
			// Read current value
			var value = files[i];

			// Check if value is a string
			if (typeof value === "string")
			{
				// Auto match source to context
				var c = setExt (value, "json");

				value =
					// Convert value into an object
					{ source: value, context: c };
			}

			// Verify value is an object
			if (typeof value !== "object")
				grunt.warn ("Sources must be objects or strings");

			// Retrieve source and context
			var src = value.source  || "";
			var ctx = value.context || {};

			// Resolve source path
			src = path.resolve (src);

			// Expand if context is a file
			if (typeof ctx === "string")
				if (grunt.file.isFile (ctx))
				{
					ctx = JSON.parse
						(grunt.file.read (ctx));

				} else ctx = { };

			// Verify context is an object
			if (typeof ctx !== "object")
				grunt.warn ("Context must be a path to a context or an object");

			ctx.layout = typeof
				// Handle the override layout
				value.layout === "undefined" ?
				options.layout : value.layout;

			ctx.layout = ctx.layout ?
				// Resolve layout path, if available
				path.resolve (ctx.layout) : false;

			// Compile the current file
			compile (options, src, ctx,
				function (error, result)
				{
					if (!error)
						// Write the resulting data
						grunt.file.write (i, result);

					// Finish signal
					callback (error);
				});

		}, done);
	});



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////
	/// Expands and verifies the specified options. Options are passed by reference.

	var expand = function (options)
	{
		// Iterate through all helpers
		for (var i in options.helpers)
		{
			// Read the current value
			var v = options.helpers[i];

			// Expand if value is a module
			if (typeof v === "string" &&
				grunt.file.isFile (v))
			{
				v = require
					(path.resolve (v));
			}

			// Verify value is a function
			if (typeof v !== "function")
				grunt.warn ("Helpers must be a path to a module or a function");

			// Store current value
			options.helpers[i] = v;
		}

		// Iterate through all partials
		for (var i in options.partials)
		{
			// Read the current value
			var v = options.partials[i];

			// Expand if value is a file
			if (typeof v === "string" &&
				grunt.file.isFile (v))
				v = grunt.file.read (v);

			// Verify value is a string
			if (typeof v !== "string")
				grunt.warn ("Partials must be a path to a partial or a string");

			// Store current value
			options.partials[i] = v;
		}
	}

	////////////////////////////////////////////////////////////////////////////////
	/// Replaces the file extension of file with ext and returns the result.
	/// If ext is unspecified, the file extension is instead simply removed.

	var setExt = function (file, ext)
	{
		// Retrieve the last dot index
		var dot = file.lastIndexOf (".");

		dot = (dot >= 0) ?
			// Strip the file extension
			file.substr (0, dot) : file;

		// Add the new extension, if any
		return dot + (ext ? "." + ext : "");
	}

	////////////////////////////////////////////////////////////////////////////////
	/// Compiles the specified arguments into a static html result using hbs.
	/// options: Includes the layout path as well as helpers and partials.
	/// src ctx: The source path and context object to use when compiling.
	/// callback (error, result): Function to call when compiling is done.

	var compile = function (options, src, ctx, callback)
	{
		// Create a new hbs instance
		var instance = hbs.create();

		// Iterate and register helpers
		for (var i in options.helpers)
		{
			instance.registerHelper
				(i, options.helpers[i]);
		}

		// Iterate and register partials
		for (var i in options.partials)
		{
			instance.registerPartial
				(i, options.partials[i]);
		}

		// Add an empty settings attribute
		ctx.settings = ctx.settings || { };
		// Ignore the views path
		ctx.settings.views = "";

		// Simulate an express rendering call
		instance.__express (src, ctx, callback);
	}
}



//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

exports = module.exports = gruntApp;
