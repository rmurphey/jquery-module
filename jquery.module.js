/*
	jQuery.hitch() -  Advanced scope manipulation for jQuery 
	version: 0.1, Peter Higgins (dante at dojotoolkit.org)

	(c) 2004-2009 The Dojo Foundation - adapted from `dojo.hitch`
	Either AFL/New BSD license, see: http://dojotoolkit.org/license 
*/

$.hitch = function(scope, method){
	// summary: Create a function that will only ever execute in a given scope
	if(!method){ method = scope; scope = null; }
	if(typeof method == "string"){
		scope = scope || window;
		if(!scope[method]){ throw(['method not found']); }
		return function(){ return scope[method].apply(scope, arguments || []); };
	}
	return !scope ? method : function(){ return method.apply(scope, arguments || []); };
};	

$.modules = {};

var n = $.extend({
	"_root" : "./"
}, $.namespaces);

var Module = function(p) {
	var F = function() {
		this.init();
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
		
		var head = document.getElementsByTagName("head")[0];
		var script = document.createElement("script");
		script.src = this.getPath(m);
		
		var that = this;

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
		var timeout = setTimeout($.hitch(this, function() {
			if (this.loaded) { 
				cb(); 
				clearTimeout(timeout); 
				return;
			} 
			
			if (++count > 50) {
				clearTimeout(timeout);
				err();
			}
		}), 100)
	};
	
	return this;
};

$.module = function(moduleName, tmp, p) {
	// TODO: handle deeper namespaces
	var m = moduleName.split('.');
	window[m[0]] = { };
	window[m[0]][m[1]] = new Module(p);
};

$.loadModule = function(m) {
	var loader = new Loader(m);
	loader.load();
	return loader;
};