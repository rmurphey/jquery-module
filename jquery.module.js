(function($){
	var _isFn = $.isFunction,
		_ext = $.extend;
		
	$.module = function(
		moduleName	/* String */, 
		inherited 	/* Module(s) to Inherit (String or Array) */, 
		proto 		/* Module Prototype */
	) {
		if (arguments.length === 2) {
			proto = inherited;
			inherited = []
		}
		
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
		/* Thanks to $.widget from jQuery UI for helping to clarify how to do this */
		var inherited,
			F = function() {
				_isFn(this.init) && this.init.apply(this, arguments);
				return this;
			};
			
		if (inherited) {
			inherited = $.isArray(inherited) ? inherited : [ inherited ];

			inherited = $.map(inherited.reverse(), function(inheritedModule) {
				if (inheritedModule === undefined) {
					throw('Missing dependency for ' + moduleName);
					return null;
				}
				inheritedModule = _isFn(inheritedModule) ? inheritedModule.prototype : inheritedModule;
				F.prototype = _extend({}, F.prototype, inherited);
				return inheritedModule;
			});

			F.prototype.inherited = function(method) {
				var inheritedModule = inherited[inherited.length-1];

				var fn, s, 
					methodPassed = (typeof(method) === 'string' && inheritedModule.prototype[method]);

				fn = inheritedModule[methodPassed ? method : 'init'];
				_isFn(fn) && fn.apply(this, Array.prototype.slice.call(arguments).slice(methodPassed ? 0 : 1));
			}
		}

		F.prototype = _extend({}, F.prototype, p);
		return F;
	};
})(jQuery);