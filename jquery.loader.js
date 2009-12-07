(function($){
	
	$.modules = {};
	$.provided = {};

	/*
	 * $.namespaces would be provided by the user, 
	 * but if it wasn't provided we'd use semi-sensible defaults.
	 * it would need to be provided before this file was included
	 */
	var n = $.extend({
		"_root" : "./"
	}, $.namespaces);
	
	/* this loader needs to be adapted to use labjs */
	$._Loader = function(m, cb) {
		this.module = m;
		
		if (m in jQuery.modules) {
			cb && cb();
			return $.modules[m];
		}
		
		this.callbacks = [];
		cb && jQuery.isFunction(cb) && this.callbacks.push(cb);
		
		var self = this;
		
		$.getScript(this._getPath(), function() {
			self._onLoad();
		});
		
		return this;
	};
	
	$._Loader.prototype = {
		loaded : false,
		
		_getPath : function() {
			/* TODO: deal with deeper namepsacing */
			var m = this.module.split('.');
			var namespace = m[0];
			var file = m[1] + '.js';
			return n._root + ( n[namespace] || (namespace + '/') ) + file;
		},
		
		_onLoad : function() {
			$.modules[this.module] = this;

			if (jQuery.provided[this.module]) {
				this.loaded = true;
				$.each(this.callbacks, function(i, fn) {
					fn();
				});
			} 
		},
		
		done : function(cb) {
			if (this.loaded && jQuery.provided[this.module]) {
				cb();
			} else {
				this.callbacks.push(cb);
			}
			
			return this;
		}
	};

	$.require = function(m, cb) {
		return new $._Loader(m, cb);
	};

	$.provide = function(m) {
		$.provided[m] = true;
	};

})(jQuery);