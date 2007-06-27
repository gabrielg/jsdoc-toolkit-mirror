Abstract.Insertion = function(adjacency) {
  this.adjacency = adjacency;
}

Abstract.Insertion.prototype = {
	contentFromAnonymousTable: function() {
		var div = document.createElement('div');
		div.innerHTML = '<table><tbody>' + this.content + '</tbody></table>';
		return $A(div.childNodes[0].childNodes[0].childNodes);
	}
}

/**@name Element.ClassNames */
Element.ClassNames = Class.create();
Element.ClassNames.prototype = {
  initialize: function(element) {
    this.element = $(element);
  },

  _each: function(iterator, callback) {
    this.element.className.split(/\s+/).select(function(name) {
      return name.length > 0;
    })._each(iterator);
  },

  set: function(className) {
    this.element.className = className;
  },

  add: function(classNameToAdd) {
    if (this.include(classNameToAdd)) return;
    this.set(this.toArray().concat(classNameToAdd).join(' '));
  }
}