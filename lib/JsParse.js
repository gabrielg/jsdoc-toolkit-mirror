/**
 * @fileOverview Find functions in tokenized JavaScript source code.
 * @author Michael Mathews, micmath@gmail.com
 * @revision $Id$
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 *          (See the accompanying README file for full details.)
 */

SYM = {
	OBJECT:			"OBJECT",
	FUNCTION:		"FUNCTION",
	CONSTRUCTOR:	"CONSTRUCTOR",
	METHOD:			"METHOD",
	VIRTUAL:		"VIRTUAL",
};
 
Symbol.prototype.toString = function() {
	return "[object Symbol]";
}

Symbol.prototype.is = function(what) {
    return this.type === SYM[what];
}

function JsParse(){};

JsParse.prototype.parse = function(tokenStream) {
	this.symbols = [];
	this.overview = null;
	
	while(tokenStream.next()) {
		if (this.findDocComment(tokenStream)) continue;
		if (this.findFunction(tokenStream)) continue;
		if (this.findVariable(tokenStream)) continue;
	}
}

JsParse.prototype.onObLiteral = function(ts, scope) { /*dbg*///print("onObLiteral");
	while (ts.next()) {
		if (ts.look().is("NAME") && ts.look(1).is("COLON")) {
			// like foo: function
			if (ts.look(2).is("FUNCTION")) {
				var name;
				var doc = "";
				
				if (ts.look(-1).is("JSDOC")) doc = ts.look(-1).data;
				name = scope.join(".")+"."+ts.look().data;
				
				if (name) {
					var paramTokens = ts.balance("LEFT_PAREN");
					var params = [];
					for (var i = 0; i < paramTokens.length; i++) {
						if (paramTokens[i].is("NAME"))
							params.push(paramTokens[i].data);
					}
					
					var body = ts.balance("LEFT_CURLY");

					this.symbols.push(
						new Symbol(name, params, body, SYM.FUNCTION, null, doc)
					);
					
// TODO find methods in the body
				}
			}
			// like foo: {...}
			else if (ts.look(2).is("LEFT_CURLY")) { // another nested object literal
				if (ts.look(-1).is("JSDOC")) {
					doc = ts.look(-1).data;
					name = scope.join(".")+"."+ts.look().data;

					this.symbols.push(
						new Symbol(name, [], "", SYM.OBJECT, null, doc)
					);
				}
				
				scope.push(ts.look().data);
				var inner = ts.balance("LEFT_CURLY");
				this.onObLiteral(new TokenStream(inner), scope); // recursive
				scope.pop();
			}
			else { // like foo: 1, or foo: "one"
				if (ts.look(-1).is("JSDOC")) { // we only grab these if they are documented
					doc = ts.look(-1).data;
					name = scope.join(".")+"."+ts.look().data;

					this.symbols.push(
						new Symbol(name, [], "", SYM.OBJECT, null, doc)
					);
				}
				
				while (!ts.look().is("COMMA")) { // skip to end of RH value ignoring things like bar({blah, blah})
					if (ts.look().is("LEFT_PAREN")) ts.balance("LEFT_PAREN");
					else if (ts.look().is("LEFT_CURLY")) ts.balance("LEFT_CURLY");
					else if (!ts.next()) break;
				}
			}
		}
	}
}
JsParse.prototype.findDocComment = function(ts) { /*dbg*///print("findDocComment "+ts.look());
	// like /** @alias foo.bar */
	if (ts.look().is("JSDOC")) {
		var doc = ts.look().data;
		if (/@alias\s+(.+)\s*/i.test(doc)) {
			this.symbols.push(
				new Symbol(RegExp.$1, [], "", SYM.VIRTUAL, null, doc)
			);
			ts.array[ts.cursor] = new Token("\n", "WHIT", "NEWLINE");
			return true;
		}
		else if (/@(projectdescription|fileoverview)\b/i.test(doc)) {
			this.overview = doc.replace(RegExp.$1, "overview"); // synonym
			ts.array[ts.cursor] = new Token("\n", "WHIT", "NEWLINE");
			return true;
		}
	}
	return false;
}

JsParse.prototype.findVariable = function(ts) { /*dbg*///print("findVariable  "+ts.look());
	// assumes function definitions are already gone
	if (ts.look().is("NAME") && ts.look(1).is("ASSIGN")) {
		// like var foo = 1
		var name = ts.look().data;
		
		var doc;
		if (ts.look(-1).is("JSDOC")) doc = ts.look(-1).data;
		else if (ts.look(-1).is("VAR") && ts.look(-2).is("JSDOC")) doc = ts.look(-2).data;

		if (doc) { // we only grab these if they are documented
			this.symbols.push(
				new Symbol(name, [], "", SYM.OBJECT, null, doc)
			);
		}
		
		// like foo = {
		if (ts.look(2).is("LEFT_CURLY")) {
			var literal = ts.balance("LEFT_CURLY");
			this.onObLiteral(new TokenStream(literal), [name]);
		}
		return true;
	}
	return false;
}

JsParse.prototype.findFunction = function(ts) { /*dbg*///print("findFunction "+ts.look());
	if (ts.look().is("FUNCTION")) {
		var name;
		var params = "";
		var doc = "";
		var type = SYM.FUNCTION;
		var body = "";
		var paramTokens = [];
		var params = [];
		
		// like function foo()
		if (ts.look(1).is("NAME")) {
			name = ts.look(1).data;
			if (ts.look(-1).is("JSDOC")) {
				doc = ts.look(-1).data;
			}
			paramTokens = ts.balance("LEFT_PAREN");
			body = ts.balance("LEFT_CURLY");
		}
		
		// like var foo = function()
		else if (ts.look(-1).is("ASSIGN") && ts.look(-2).is("NAME")) {
			name = ts.look(-2).data;
			if (ts.look(-3).is("VAR") && ts.look(-4).is("JSDOC")) {
				doc = ts.look(-4).data;
			}
			if (ts.look(-3).is("JSDOC")) {
				doc = ts.look(-3).data;
			}
			
			paramTokens = ts.balance("LEFT_PAREN");
			body = ts.balance("LEFT_CURLY");
			
			// like foo = function(n) {return n}(42)
			if (ts.look(1).is("LEFT_PAREN")) { // false alarm, it's not really a named function definition
				type = SYM.OBJECT;
				paramTokens = [];
				body = "";
				ts.balance("LEFT_PAREN");
				if (!doc) return true; // we don't keep these unless they are documented
				else return false;     // let findVariable have it
			}
		}
		
		// like var foo = new function()
		else if (ts.look(-1).is("NEW") && ts.look(-2).is("ASSIGN") && ts.look(-3).is("NAME")) {
			name = ts.look(-3).data;
			type = SYM.OBJECT;
			if (ts.look(-4).is("VAR")) {
				if (ts.look(-5).is("JSDOC")) {
					doc = ts.look(-5).data;
				}
			}
			if (ts.look(-4).is("JSDOC")) {
				doc = ts.look(-4).data;
			}
		}
		
		if (name) {
			if (type == SYM.FUNCTION) {
				for (var i = 0; i < paramTokens.length; i++) {
					if (paramTokens[i].is("NAME"))
						params.push(paramTokens[i].data);
				}
			}
			
			if (name.indexOf(".prototype.") > 0) {
				type = SYM.METHOD;
				name = name.replace(".prototype.", "/");
			}

			this.symbols.push(
				new Symbol(name, params, body, type, null, doc)
			);
			
			if (body) {
				var fs = new TokenStream(body);
				var parent = name;
				
				this.onFnBody(fs, [name])
				
				
			}
			return true;
		}
	}
	return false;
}

JsParse.prototype.onFnBody = function(fs, scope) {
	while (fs.look()) {
		if (fs.look().is("NAME") && fs.look(1).is("ASSIGN")) {
			name = fs.look().data;
			if (/^this\./.test(name)) {
			
// TODO handle object literals like this.foo = { bar: function(){} }

				// like this.foo = function
				if (fs.look(2).is("FUNCTION")) {
					type = SYM.METHOD;
					var parent = scope[scope.length-1];
					name = name.replace("this.", parent+"/");
					
					doc = "";
					if (fs.look(-1).is("JSDOC")) doc = fs.look(-1).data;
					
					var paramTokens = fs.balance("LEFT_PAREN");
					var params = [];
					for (var i = 0; i < paramTokens.length; i++) {
						if (paramTokens[i].is("NAME")) params.push(paramTokens[i].data);
					}
					
					body = fs.balance("LEFT_CURLY");

					// like this.foo = function(n) {return n}(42)
					if (fs.look(1).is("LEFT_PAREN")) { // false alarm, it's not really a named function definition
						type = SYM.OBJECT;
						paramTokens = [];
						body = "";
						fs.balance("LEFT_PAREN");
						if (!doc) break; // we don't keep these unless they are documented
					}

					this.symbols.push(
						new Symbol(name, params, body, type, null, doc)
					);
				}
			}
		}
		if (!fs.next()) break;
	}
}
