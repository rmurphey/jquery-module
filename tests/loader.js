module("Loader");

jQuery.namespaces = {
	"_root" : 	"./",
	"foo" : 	"foo/"
};

asyncTest("loading", function() {
	$.modules = {};
	var bar = false, 
		baz = false,
		bim = false;

	var goodLoader = new $._Loader('foo.MyModule', function() { bar = true; }),
		badLoader = new $._Loader('bar.bim.MyModule', function() { baz = true; }),
		unprovidedLoader = new $._Loader('foo.MyOtherModule', function() { bim = true; });

	equals(goodLoader._getPath(), './foo/MyModule.js', "got correct path using namespace config");
	equals(badLoader._getPath(), './bar/bim/MyModule.js', "intuited right path from module name");

	setTimeout(function() {
		ok(bar, "script loaded");
		ok(!!jQuery.provided['foo.MyModule'] === true, 	"module provided");
		ok(!!jQuery.modules['foo.MyModule'] === true, 	"module registered");

		ok(!!baz === false, "callback shouldn't run if script isn't found");
		ok(!!jQuery.modules['bar.MyModule'] === false, "nonexistent module shouldn't be found");
		
		ok(!!bim === false, "callback shouldn't run if module isn't provided");
		
		start();
	}, 500);
});