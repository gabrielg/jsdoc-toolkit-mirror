// looks like a function

var Item = function(pid) {
	/** The item name */
	this.name = function(n) {
	}(pid);
};

/** The price */
Item.Price = function(n) {
}(1.99);

/** The product */
Product = new function(pid) {
	/** The seller */
	this.seller = "Acme";
}

/*
jsdoc = {
	files: [

		{
			"path": "test/data/test6.js",
			"overview": {
				"name": "test6.js",
				"desc": ""
			},
			"symbols": [
				{
					"type": "PROPERTY",
					"name": "{Item}.name",
					"desc": "The item name"
					,
					"params": [

					]
				},
				{
					"type": "OBJECT",
					"name": "Item.Price",
					"desc": "The price"

				},
				{
					"type": "OBJECT",
					"name": "Product",
					"desc": "The product"

				},
				{
					"type": "PROPERTY",
					"name": "{Product}.seller",
					"desc": "The seller"
					,
					"params": [

					]
				}
			]
		}
	]
};
*/