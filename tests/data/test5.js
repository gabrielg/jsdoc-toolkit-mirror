// prototypes


function Article() {
}

Article.prototype = {
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
