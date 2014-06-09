
var reverser = require('./reverser')

function UrlExtension() {
	this.tags = ['url'];
	this.parse = function(parser, nodes, lexer) {
		var tok = parser.nextToken()
		var args = parser.parseSignature(null, true)
		parser.advanceAfterBlockEnd(tok.value)
		return new nodes.CallExtension(this, 'run', args, [])
	}
	this.run = function(context, url, args) {
		return reverser.reverse(url, args)
	}
}

module.exports = {
	register: function(env) {
		env.addExtension('UrlExtension', new UrlExtension())
	}
}