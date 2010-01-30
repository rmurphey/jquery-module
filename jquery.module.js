(function($){
	var _e = $.extend, 
		_p = 'prototype', 
		_f = $.isFunction; 
	
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
		o[c][_p]._moduleName = moduleName;
	};

	var Module = function(p, base) {
		/* 	
			Thanks to $.widget from jQuery UI for helping to clarify how to do this
		*/
		var b = $.isArray(base) ? base : [ base ],
			F = function() {
				this.init.apply(this, arguments);
				return this;
			};
			
		b = $.map(b.reverse(), function(base, i) {
			var base = _f(base) ? base[_p] : base;
			F[_p] = _e({}, F[_p], base);
			return base;
		});
			
		F[_p] = _e({}, F[_p], p);
		
		F[_p].inherited = function(method) {
			if (!b.length) { return; }

			var fn, s, m = typeof(method) === 'string';
			
			fn = b[b.length-1][m ? method : 'init'];
			_f(fn) && fn.apply(this, Array[_p].slice.call(arguments).slice(m ? 0 : 1));
		}

		return F;
	};
})(jQuery);