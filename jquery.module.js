(function($){
	$.module = function(
		moduleName	/* String */, 
		base 		/* Module(s) to Inherit (String or Array) */, 
		p 			/* Module Prototype */
	) {
		var m = moduleName.split('.'),
			c = m.pop(),
			o = window;
			
		$.each(m, function(i, v){
			o[v] = o[v] || {};
			o = o[v];
		});
		
		o[c] = new Module(p, base);
		o[c].prototype._moduleName = moduleName;
	};

	var Module = function(p, base) {
		/* 	
			Thanks to $.widget from jQuery UI  
			for helping to clarify how to do this
		*/
		var b = $.isArray(base) ? base : [ base ],
			F = function() {
				this.init.apply(this, arguments);
				return this;
			};
			
		b = $.map(b, function(base, i) {
			var base = $.isFunction(base) ? base.prototype : base;
			F.prototype = $.extend({}, F.prototype, base);
			return base;
		});
			
		F.prototype = $.extend({}, F.prototype, p);
		
		F.prototype.inherited = function(method) {
			var args, fn, s, _aps = Array.prototype.slice;
			
			if (!b.length) { return; }
			
			if (!typeof(method) == 'string') {
				method = 'init';
				s = 0;
			} else {
				s = 1;
			}
			
			args = _aps.call(arguments).slice(s);
			fn = b[0][method];
				
			if ($.isFunction(fn)) {
				fn.apply(this, args);
			}
		}

		return F;
	};
})(jQuery);