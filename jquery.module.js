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

	/* 
	 * the idea of this is to be a super-lightweight module factory;
	 * it could optionally be replaced by jQuery.widget, but currently
	 * that is only available in jQuery UI
	 */
	$._Module = function(p) {
		var F = function(args) {
			var args = args;
			this.init && this.init(args);
			return this;
		};

		F.prototype = p;
		return F;
	};

	// usage:
	// $.module('foo.Bar', null, prototype);
	$.module = function(moduleName, tmp, p) {
		/* TODO: deal with deeper namespacing */
		var m = moduleName.split('.'),
		    o = window[m[0]] = window[m[0]] || {};
		o[m[1]] = new $._Module(p);
	};
	
	
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

				return function() { f.apply(that, []); }
			})(this), 100)
		};

		return this;
	};

	// usage:
	// $.loadModule('foo.Bar').done(function() { ... });
	$.loadModule = function(m) {
		return (new $._Loader(m)).load();
	};

	$.provide = function(m) {
		$.provided[m] = true;
	};
})(jQuery);
