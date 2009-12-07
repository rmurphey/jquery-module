(function($){
	/* 
	 * the idea of this is to be a super-lightweight module factory;
	 * it could optionally be replaced by jQuery.widget, but currently
	 * that is only available in jQuery UI
	 */
	$.module = function(moduleName, inherits, p) {
		var m = moduleName.split('.'),
			c = m.pop(),
			o = window;
		
		$.each(m, function(i, v){
			o[v] = o[v] || {};
			o = o[v];
		});
		
		o[c] = new $._Module(p, inherits);
	};

	$._Module = function(p, inherits) {
		var inherits = inherits || [];
		var args = [ p ];
		
		$.each(inherits, function(i, obj) {
			args.push(obj.prototype);
		});
		
		var F = function(args) {
			var args = args;
			this.init && this.init(args);
			return this;
		};
		
		F.prototype = $.extend.apply(F, args);
		return F;
	};
})(jQuery);
