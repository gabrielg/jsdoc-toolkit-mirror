// prototypes

/** @constructor */
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

/** this comment should be ignored */
Paragraph.lines.prototype = new Array(1);