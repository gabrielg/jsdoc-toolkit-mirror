/**
 * @fileOverview This "library" contains "a 
 *               lot of classes and functions.
 * @example <code>
	alert("This 'is' \"code\"");
 </code>
 * @name My Cool Library
 * @author 	Joe Smith jsmith@company.com
 * @version 	0.1 
 */
 
/** 
 * Gets the current foo 
 * @param {String} fooId	The unique identifier for the foo.
 * @return {Object}	Returns the current foo.
 */
function getFoo(fooID){
}

/*
jsdoc = {
	files: [

		{
			"path": "test/data/overview.js",
			"overview": {
				"name": "My Cool Library",
				"desc": "This \"library\" contains \"a \r	       lot of classes and functions.",
				"tags": [
					{
						"title": "example",
						"desc": "<code>\r\n\talert(\"This 'is' \\\"code\\\"\");\r\n </code>"
					},
					{
						"title": "author",
						"desc": "Joe Smith jsmith@company.com"
					},
					{
						"title": "version",
						"desc": "0.1"
					}
				]
			},
			"symbols": [
				{
					"type": "FUNCTION",
					"name": "getFoo",
					"desc": "Gets the current foo"
					,
					"params": [
						{
							"type": "String",
							"name": "fooId", 
							"desc": "The unique identifier for the foo. "
						}
					]
				}
			]
		}
	]
};
*/