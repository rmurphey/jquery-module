(function($){
	/* 
	 * the idea of this is to be a super-lightweight module factory;
	 * it could optionally be replaced by jQuery.widget, but currently
	 * that is only available in jQuery UI
	 */
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
				this.init && typeof(this.init) == 'function' && this.init(c);
			
				$.each(args, function(i, arg) {
					arg.init && arg.init(c);
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