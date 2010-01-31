(function($){
	$.module = function(
		moduleName	/* String */, 
		inherited 		/* Module(s) to Inherit (String or Array) */, 
		proto 		/* Module Prototype */
	) {
		var moduleNamePieces = moduleName.split('.'),
			className = moduleNamePieces.pop(),
			inheritedObject = window;
			
		$.each(pieces, function(i, v){
			inheritedObject[v] = inheritedObject[v] || {};
			inheritedObject = inheritedObject[v];
		});
		
		o[className] = new Module(proto, inherited, moduleName);
		o[className].prototype._moduleName = moduleName;
	};

	var Module = function(p, inherited, moduleName) {
		/* 	
			Thanks to $.widget from jQuery UI for helping to clarify how to do this
		*/
		var inherited = $.isArray(inherited) ? inherited : [ inherited ],
			F = function() {
				$.isFunction(this.init) && this.init.apply(this, arguments);
				return this;
			};
			
		inherited = $.map(inherited.reverse(), function(inherited, i) {
			if (inherited === undefined) {
				throw('Missing dependency for ' + moduleName);
				return null;
			}
			var inherited = $.isFunction(inherited) ? inherited.prototype : inherited;
			F.prototype = $.extend({}, F.prototype, inherited);
			return inherited;
		});
			
		F.prototype = $.extend({}, F.prototype, p);
		
		F.prototype.inherited = function(method) {
			if (!inherited.length) { return; }
			var inheritedClass = inherited[inherited.length-1];

			var fn, s, 
				methodPassed = (typeof(method) === 'string' && inheritedClass.prototype[method]);
			
			fn = inheritedClass[methodPassed ? method : 'init'];
			$.isFunction(fn) && fn.apply(this, Array.prototype.slice.call(arguments).slice(methodPassed ? 0 : 1));
		}

		return F;
	};
})(jQuery);