// nested objects and nested constructors

var yipee = {
	Project: {
		/** @constructor */
		PageFactory: function() {
			/**
			 *	@constructor 
			 *	@property {array} Elements
			 */
			this.Page = function(elements) {
				this.getElement = function(elName, maxEls) {
				}
				this.Elements = [];
			}
		}
	},
	
	url: {
		/** Project home page */
		homepage: "http://example.com/"
	}
}