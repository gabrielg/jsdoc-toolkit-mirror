/**
 * @fileOverview Find functions in tokenized JavaScript source code.
 * @author Michael Mathews, micmath@gmail.com
 * @revision $Id$
 * @license <a href="http://en.wikipedia.org/wiki/MIT_License">X11/MIT License</a>
 *          (See the accompanying README file for full details.)
 */
 
Symbol.prototype.toString = function() {
	return "[object Symbol]";
}

Symbol.prototype.is = function(what) {
    return this.type === SYM[what];
}

SYM = {
	OBJECT:			"OBJECT",
	FUNCTION:		"FUNCTION",
	CONSTRUCTOR:	"CONSTRUCTOR",
	METHOD:			"METHOD",
	VIRTUAL:		"VIRTUAL",
};

function JsParse(){};

JsParse.prototype.parse = function(tokenStream) {
	this.symbols = [];
	this.overview = null;
	
	while(tokenStream.next()) {
		if (this.findDocComment(tokenStream)) continue;
		if (this.findFunction(tokenStream)) continue;
		if (this.findObLiteral(tokenStream)) continue;
		
	}
}

JsParse.prototype.onObLiteral = function(ts, scope) { /*dbg*///print("onObLiteral");
	while (ts.next()) {
		if (ts.look().is("NAME") && ts.look(1).is("COLON")) {
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
				}
			}
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
			else { // property is not a function or literal.
				if (ts.look(-1).is("JSDOC")) {
					doc = ts.look(-1).data;
					name = scope.join(".")+"."+ts.look().data;

					this.symbols.push(
						new Symbol(name, [], "", SYM.OBJECT, null, doc)
					);
				}
				
				while (!ts.look().is("COMMA")) { // skip to end of RH value ignoring ({bla, bla})
					if (ts.look().is("LEFT_PAREN")) ts.balance("LEFT_PAREN");
					else if (ts.look().is("LEFT_CURLY")) ts.balance("LEFT_CURLY");
					else if (!ts.next()) break;
				}
			}
		}
	}
}
JsParse.prototype.findDocComment = function(ts) { /*dbg*///print("findDocComment "+ts.look());
	var doc;
	
	if (ts.look().is("JSDOC")) {
		doc = ts.look().data;
		if (/@alias\s+(.+)\s*/i.test(doc)) {
			var name = RegExp.$1;

			this.symbols.push(
				new Symbol(name, [], "", SYM.VIRTUAL, null, doc)
			);
			ts.array[ts.cursor] = new Token("\n", "WHIT", "NEWLINE");
			return true;
		}
		else if (/@(projectdescription|(file)?overview)\b/i.test(doc)) {
			doc = doc.replace(RegExp.$1, "overview");
			this.overview = doc;
			ts.array[ts.cursor] = new Token("\n", "WHIT", "NEWLINE");
			return true;
		}
	}
	return false;
}

// like foo = something	
JsParse.prototype.findObLiteral = function(ts) { /*dbg*///print("findObLiteral  "+ts.look());
	if (ts.look().is("NAME") && ts.look(1).is("ASSIGN")) {
		if (ts.look(2).is("FUNCTION")) return false;
		var name = ts.look().data;
		
		var doc;
		if (ts.look(-1).is("JSDOC")) doc = ts.look(-1).data;
		else if (ts.look(-1).is("VAR") && ts.look(-2).is("JSDOC")) doc = ts.look(-2).data;

		if (doc) {
			this.symbols.push(
				new Symbol(name, [], "", SYM.OBJECT, null, doc)
			);
		}
		
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
			if (ts.look(1).is("LEFT_PAREN")) {
				type = SYM.OBJECT;
				paramTokens = [];
				body = "";
				ts.balance("LEFT_PAREN");
				if (!doc) return true;
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
			//if (!body) body = ts.balance("LEFT_CURLY");
			
			if (name.indexOf(".prototype.") > 0) {
				type = SYM.METHOD;
				name = name.replace(".prototype.", "/");
			}

			this.symbols.push(
				new Symbol(name, params, body, type, null, doc)
			);
			
			if (body) {
				var fs = new TokenStream(body);

				while (fs.look()) {
					if (fs.look().is("FUNCTION")) {
						if (fs.look(-1).is("ASSIGN") && fs.look(-2).is("NAME")) {
							type = SYM.METHOD;
							var mName = fs.look(-2).data;
							if (/^this\./.test(mName)) {
								var mDoc = "";
								if (fs.look(-3).is("JSDOC")) {
									mDoc = fs.look(-3).data;
								}
								
								mName = mName.replace("this.", name+"/");
								var mParamTokens = fs.balance("LEFT_PAREN");
								var mParams = [];
								for (var i = 0; i < mParamTokens.length; i++) {
									if (mParamTokens[i].is("NAME"))
										mParams.push(mParamTokens[i].data);
								}
								
								var mBody = fs.balance("LEFT_CURLY");

								this.symbols.push(
									new Symbol(mName, mParams, mBody, type, null, mDoc)
								);
							}
						}
					}
					if (!fs.next()) break;
				}
			}
			return true;
		}
	}
	return false;
}
