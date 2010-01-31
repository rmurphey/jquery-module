// factory for instantiating a class based on markup
$.module('Factory', null, {
	init : function(node) {
		this.types = {
			"twitter" : 	Widget.Twitter,
			"rss" : 		Widget.Rss
		};
		
		var type = node.attr('data-type');
		this.types[type] && new this.types[type](node);
	}
});

// abstract classes to be inherited
$.module('Widget._fetcher', null, {
	cbParam  : 'callback',
	
	init : function(node) {
		this.target = $('<div class="target"/>').appendTo(node);
		this.fetch();
	},
	
	fetch : function() {
		$.ajax({
			dataType : 'jsonp',
			url : this.baseUrl + '&' + this.cbParam + '=?',
			success : this.handler
		});
	}
});

$.module('Widget._defaultHandler', null, {
	handleResponse : function(resp) {
		console.log(resp);
	}
});

// classes to be instantiated based on markup
$.module('Widget.Twitter', Widget._fetcher, {
	baseUrl : "http://twitter.com/status/user_timeline/${username}.json?count=10",
	
	init : function(node) {
		this.baseUrl = this.baseUrl.replace('${username}', node.attr('data-user'));
		this.handler = this.handleResponse;
		this.super(node);
	},
	
	handleResponse : function(resp) {
		console.log('twitter: ', resp);
	}
});

$.module('Widget.Rss', [ Widget._fetcher, Widget._defaultHandler ], {
	baseUrl : "http://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20rss%20where%20url%3D",
	
	init : function(node) {
		this.baseUrl = this.baseUrl + escape("'" + node.attr('data-url') + "'");
		this.handler = this.handleResponse;
		this.super(node);
	}
});