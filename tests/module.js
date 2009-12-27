module("Module");

test("basic module creation", function() {
	var initialized = false; 
	
	$.module('foo.MyModule', null, {
		init : function() {
			initialized = true;
		}
	});
	
	new foo.MyModule();
	ok(!!foo === true, "created namespace");
	ok(!!foo.MyModule === true, "created module at correct location");
	ok(!!initialized === true, "init method runs on module creation");
});

test("nested module namespace", function() {
	var init = false;
	
	$.module('foo.bar.baz.M', null, {
		init : function() {
			init = true;
		}
	});
	
	ok(window.foo && window.foo.bar && window.foo.bar.baz, "Nested namespaces should be created");
	
	new foo.bar.baz.M();
	
	ok(!!init === true, "Nested namespace module should initialize");
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

test("inheritance", function() {
	$.module('bar.MyModule', null, {
		barProperty : true
	});
	
	$.module('foo.MyModule', [ bar.MyModule, { otherProperty : true } ], {
		fooProperty : true
	});
	
	var myFooInstance = new foo.MyModule();
	ok(!!myFooInstance.otherProperty === true, "property inherited from object literal")
	ok(myFooInstance.barProperty === true && myFooInstance.fooProperty === true, "property inherited from module");

	var myBarInstance = new bar.MyModule();
	ok(!!myBarInstance.fooProperty === false, "no cross-pollination of properties");
	
});