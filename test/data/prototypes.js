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

function Person(){
}
Person.prototype.setName = function(name) {
	/** the person's name */
    this.name = name;
	
	/** get the person's name */
    this.getName = function(){return name};
}
