////////////////////////////////////////////////////////////////////////////////
// -------------------------------------------------------------------------- //
//                                                                            //
//                        (C) 2013-2014  David Krutsko                        //
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
				var c = { };

				// Auto match source to context
				if (grunt.file.isFile (value))
					c = setExt (value, "json");

				value =
					// Convert value into an object
					{ source: value, context: c };
			}

			// Verify value is an object
			if (typeof value !== "object")
				grunt.warn ("Sources must be objects or strings");

			// Retrieve source and context
			var src = value. source || "";
			var ctx = value.context || {};

			// Expand if source is a file
			if (grunt.file.isFile (src))
				src = grunt.file.read (src);

			// Expand if context is a file
			if (typeof ctx === "string")
				if (grunt.file.isFile (ctx))
				{
					ctx = JSON.parse
						(grunt.file.read (ctx));

				} else ctx = { };

			// Verify source is a string
			if (typeof src !== "string")
				grunt.warn ("Source must be a path to a source or an HTML string");

			// Verify context is an object
			if (typeof ctx !== "object")
				grunt.warn ("Context must be a path to a context or an object");

			// Finish signal
			return callback();

		}, done);
	});



	//----------------------------------------------------------------------------//
	// Functions                                                                  //
	//----------------------------------------------------------------------------//

	////////////////////////////////////////////////////////////////////////////////
	/// Expands and verifies the specified options. Options are passed by reference.

	var expand = function (options)
	{
		//----------------------------------------------------------------------------//
		// Layout                                                                     //
		//----------------------------------------------------------------------------//

		// Create a layout shortcut
		var layout = options.layout;

		// Expand if layout is a file
		if (grunt.file.isFile (layout))
			layout = grunt.file.read (layout);

		// Verify layout is a string
		if (typeof layout !== "string")
			grunt.warn ("Layout must be a path to a layout or an HTML string");

		// Store resulting value
		options.layout = layout;



		//----------------------------------------------------------------------------//
		// Helpers                                                                    //
		//----------------------------------------------------------------------------//

		// Create a helpers shortcut
		var helpers = options.helpers;

		// Iterate all helpers
		for (var i in helpers)
		{
			// Read curr value
			var v = helpers[i];

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

			// Store value
			helpers[i] = v;
		}



		//----------------------------------------------------------------------------//
		// Partials                                                                   //
		//----------------------------------------------------------------------------//

		// Create a partials shortcut
		var partials = options.partials;

		// Iterate all partials
		for (var i in partials)
		{
			// Read curr value
			var v = partials[i];

			// Expand if value is a file
			if (grunt.file.isFile (v))
				v = grunt.file.read (v);

			// Verify value is a string
			if (typeof v !== "string")
				grunt.warn ("Partials must be a path to a partial or an HTML string");

			// Store value
			partials[i] = v;
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
}



//----------------------------------------------------------------------------//
// Exports                                                                    //
//----------------------------------------------------------------------------//

exports = module.exports = gruntApp;
