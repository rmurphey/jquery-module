$.provide('myNamespace.Thinger');

$.module('myNamespace.Foo', null, {
	fooThing : 'hello world'
});

$.module('myNamespace.Bar', [ myNamespace.Foo ], {
	init : function() {
		alert(this.fooThing);
	}
});
