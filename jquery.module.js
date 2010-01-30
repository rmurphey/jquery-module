(function($){
	$.module = function(
		moduleName	/* String */, 
		inherits 	/* Array of Object Literals or Modules to Mix In */, 
		p 			/* Module Prototype */
	) {
		var m = moduleName.split('.'),
			c = m.pop(),
			o = window;
			
		$.each(m, function(i, v){
			o[v] = o[v] || {};
			o = o[v];
		});
		
		o[c] = new Module(p, inherits);
	};

	var Module = function(p, inherits) {
		var args = [ p ],
			F = function(c) {
				$.each(args, function(i, arg) {
					console.log(arg);
					arg.init && typeof(arg.init) == 'function' && arg.init(c);
				});
			
				return this;
			};
			
		inherits && $.isArray(inherits) &&
		$.each(inherits, function(i, obj) {
			if (typeof(obj) == 'function') {
				args.push(obj.prototype);
			} else {
				args.push(obj);
			}
		});
		
		F.prototype = $.extend.apply(F, args);
		return F;
	};
})(jQuery);