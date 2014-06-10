
var nj = require('./lib/nunjucks')
var reverser = require('./lib/reverser')

module.exports =  {
	nunjucks: nj.register,
	url: reverser.url,
	reverse: reverser.reverse
}