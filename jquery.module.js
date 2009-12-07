(function($){
	/* 
	 * the idea of this is to be a super-lightweight module factory;
	 * it could optionally be replaced by jQuery.widget, but currently
	 * that is only available in jQuery UI
	 */
	$.module = function(moduleName, inherits /* Array, unused at the moment */, p) {
		/* TODO: deal with deeper namespacing */
		/* TODO: allow inheritance via second arg */
		var m = moduleName.split('.'),
		    o = window[m[0]] = window[m[0]] || {};
		o[m[1]] = new $._Module(p);
	};

	$._Module = function(p) {
		var F = function(args) {
			var args = args;
			this.init && this.init(args);
			return this;
		};

		F.prototype = p;
		return F;
	};
})(jQuery);
