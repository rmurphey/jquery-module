jQuery.config = {
	namespaces : {
		myNamespace : '/js/myNamespace/'
	}
};

// this module would be in a separate file at /js/myNamepsace/MyModule.js
jQuery.module('myNamespace.MyModule', null, {
	defaults : {
		hello : 'goodbye',
		world : 'world'
	},
	
	init : function(config) {
		this.config = jQuery.extend(this.defaults, config);
		this.node = this.config.node.addClass('module-ized');
		
		// when myMethod runs, also run myOtherMethod
		jQuery.bind(this, 'myMethod', this, 'myOtherMethod');
	},
	
	myMethod : function() {
		alert(this.config.hello);
		console.log(this.node);
	},
	
	myOtherMethod : function() {
		alert(this.config.world);
	}
});

/*************************************************/

// this code would be separate
jQuery
	// load the module from jQuery.config.namespaces.myNamespace + 'MyModule.js'
	.loadModule('myNamespace.MyModule')
	
	// when the module is loaded (or if it's already available), do this stuff
	.done(function() {
		// creating a new instance automatically runs the "init" method,
		// which overrides the defaults with the config object
		var myModuleInstance = new myNamespace.MyModule({ 
			hello : 'hello', 
			node : jQuery('#module') 
		});

		// click on #foo will alert hello, log the node #module, and then alert world
		jQuery('#foo').bind('click', myModuleInstance, 'myMethod');
	
		// click on #bar will just alert world
		jQuery('#bar').bind('click', myModuleInstance, 'myOtherMethod');
	});