$.modules = {};

var n = $.extend({
	"_root" : "./"
}, $.namespaces);

var Module = function(p) {
	var F = function(args) {
		this.init && this.init(args);
		return this;
	};
	F.prototype = p;
	return F;
};

var Loader = function(m) {
	// obviously this could and should all be better
	this.module = m;
	
	this.getPath = function() {
		// TODO: get paths more than one level deep
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
				that.loaded = true;
				jQuery.modules[that.module] = true;
				script.onload = script.onreadystatechange = null;
			}
		};
		
		head.appendChild(script);
		
		return this;
	};
	
	this.done = function(cb, err) {
		var count = 0
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

$.module = function(moduleName, tmp, p) {
	var m = moduleName.split('.'),
	    o = window[m[0]] = {};       // maybe check to see if it exists already? 
	o[m[1]] = new Module(p);
};

$.loadModule = function(m) {
	return (new Loader(m)).load();
};

$.bind = function(sourceModule, sourceMethod, targetModule, targetMethod) {

};
