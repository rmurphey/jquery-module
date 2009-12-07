$.provide('foo.MyModule');

$.module('foo.MyModule', null, {
	init : function() {
		this.initialized = true;
	}
});