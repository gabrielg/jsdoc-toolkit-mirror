/**
 * @fileOverview This "library" contains "a 
 *               lot of classes and functions.
 EXAMPLE: <code>
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
/**
 * @description This is a library of geometry-related functions.
 * 
 */
 Shape2D /*constructor*/
 = {
	// Shape.Circle()
	/** @ignore */
	Circle: function(r, x, y){
	},
	Rect: "r"+makerect({
		callback: function(){
			flarp: function(){}
		}
	}),
	Triangle: { /* this is wicked };-) */
		/** A triangle with a 90 degree angle.
			@constructor
			@property {number} angles The angles.
		*/
		Right: function(a, b, c)	{}
	},
	/** The constant PI*/
	PI: 3.14,
	/** @constructor */
	Polygon: function(sides) //how many sides
	{
		this.addSide = function(newSide) {
		}
	}
};

function Shape3D(){}
	Shape3D.prototype.shrink = function(ratio) {}
/**
 * @alias Shape3D.Combine
 *
 */
Geo = <!-- ignore me
{
/* flat surface */	Plane:
		function 
		(
		w, // the width of the plane
		d  // the depth of the plane
		) {
		
		}

}

/**The e constant.*/
var E = 12345;

/** meaning of life? */
var life = function(n) {return n}(42);

// nested constructors
/** @constructor */
function ShapeFactory() {
	/** @constructor */
    this.SquareMaker = function(size) {
    	/** @constructor */
        this.Square = function(s) {
            this.size = s;
            this.display = function() {
                alert("square: "+s);
            }
        }
    }
}

