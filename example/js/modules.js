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

$.module('Widget._base', null, {
	update : false,
	init : function(node) {
		this.target = $('<div class="target"/>').appendTo(node);
	},
	
	fetch : function() {
		$.ajax({
			dataType : 'jsonp',
			url : this.baseUrl + '&' + this.cbParam + '=?',
			success : $.proxy(this.handleResponse, this)
		});
	}
});

$.module('Widget.Twitter', [ Widget._base ], {
	update : 15000,
	baseUrl : "http://twitter.com/status/user_timeline/${username}.json?count=10",
	cbParam : "callback",
	
	init : function(node) {
		this.inherited(node);
		this.baseUrl = this.baseUrl.replace('${username}', node.attr('data-user'));
		this.fetch();
	},
	
	handleResponse : function(resp) {
		console.log(resp);
	}
});

$.module('Widget.Rss', [ Widget._base ], {
	baseUrl : "http://query.yahooapis.com/v1/public/yql?format=json&q=select%20*%20from%20rss%20where%20url%3D",
	cbParam : "callback",
	
	init : function(node) {
		this.baseUrl = this.baseUrl + escape("'" + node.attr('data-url') + "'");
		this.fetch();
	},
	
	handleResponse : function(resp) {
		console.log(resp);
	}
});
