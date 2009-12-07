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
	$._Loader = function(m) {
		this.module = m;

		this.getPath = function() {
			/* TODO: deal with deeper namepsacing */
			var m = this.module.split('.');
			var namespace = m[0];
			var file = m[1] + '.js';
			return n._root + ( n[namespace] || (namespace + '/') ) + file;
		};

		this.load = function() {
			if (jQuery.modules[this.module]) {
				this.loaded = true;
				return;
			}

			var head    = document.getElementsByTagName("head")[0],
			    script  = document.createElement("script"),
			    that    = this;

			script.src = this.getPath(m);

			script.onload = script.onreadystatechange = function() {
				if (!that.loaded && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete") ) {
					if (!jQuery.provided[that.module]) { return; }
					jQuery.modules[that.module] = true;
					that.loaded = true;
					script.onload = script.onreadystatechange = null;
				}
			};

			head.appendChild(script);

			return this;
		};

		this.done = function(cb, err) {
			var count = 0;

			var timeout = setTimeout((function(that) { 
				var f = function() {
					if (this.loaded) { 
						cb && cb(); 
						clearTimeout(timeout); 
						return;
					} 

					if (++count > 50) {
						clearTimeout(timeout);
						err && err();
					}
				};

				return function() { f.apply(that, []); };
			})(this), 100);
		};

		return this;
	};

	// $.require('foo.Bar').done(function() { ... });
	$.require = function(m) {
		return (new $._Loader(m)).load();
	};

	$.provide = function(m) {
		$.provided[m] = true;
	};

})(jQuery);