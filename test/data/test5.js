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
	/** lines of text */
	this.lines = []
}
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