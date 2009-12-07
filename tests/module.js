module("Module");

test("basic module creation", function() {
	var initialized = false; 
	
	$.module('foo.MyModule', null, {
		init : function() {
			initialized = true;
		}
	});
	
	new foo.MyModule();
	ok(initialized, "init method runs on module creation");
});

test("passing arguments to new module constructors", function() {
	$.module('foo.MyModule', null, {
		config : {
			a : 'c'
		},
		
		init : function(args) {
			this.args = $.extend({}, this.config, args);
			this.foo();
		},
		
		foo : function() {
			this.thing = this.args.a;
		}
	});
	
	var myInstance = new foo.MyModule({ a : 'b' });
	equals(myInstance.thing, 'b');
	
	var myOtherInstance = new foo.MyModule();
	equals(myOtherInstance.thing, 'c');
});