// prototypes


function Article() {
}

Article.prototype = {
	/** Get the title. */
	getTitle: function(){
	}
}

var Word = function(){}
Word.prototype = String.prototype;

/** @constructor */
function Paragraph(text){
	
}
/** The lines of text. */
Paragraph.prototype.lines = []
/** Get the lines. */
Paragraph.prototype.getLines = function() {
	
}


/*
files: [
	{
		"path": "test/data/test5.js",
		"overview": {
			"name": "test5.js",
			"desc": ""
		},
		"symbols": [
			{
				"type": "FUNCTION",
				"name": "{Article}.getTitle",
				"desc": "Get the title."
				,
				"params": [

				]
			},
			{
				"type": "CONSTRUCTOR",
				"name": "Paragraph",
				"desc": ""
				,
				"params": [
					{
						"type": "",
						"name": "text", 
						"desc": " "
					}
				]
			},
			{
				"type": "PROPERTY",
				"name": "{Paragraph}.lines",
				"desc": "lines of text"
				,
				"params": [

				]
			}
		]
	}
]
};

*/