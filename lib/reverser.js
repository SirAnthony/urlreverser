
var rssi = require('rssi')

var urls = {}
var group_regex = new RegExp(/\(\?:(.+?):(\w+)(.*?)\)\?/g)

function replace_arguments(string, data) {
	return string.replace(/(\/:\w+\??)/g, function (m, c) {
		var required = !~c.indexOf('?');
		var arg = c.replace(/[/:?]/g, '')
		if (data && required)
			data.required_args.push(arg)
		return '/#{' + arg + '}'
	})
}

function replace_groups(string, opt_groups) {
	return string.replace(group_regex, function(match, prefix, target, suffix){
		opt_groups[target] = {
			prefix: prefix,
			suffix: suffix,
			target: '#{' + target + '}'
		}
		return '#{group_' + target + '}'
	})
}

function reverse_groups(string, storage, args) {
	var groups = {}
	for (var key in args) {
		if (key in storage) {
			var group = storage[key]
			groups['group_' + key] = group.prefix + group.target + group.suffix
		}
	}
	if (Object.keys(groups).length)
		string = rssi(string)(groups)
	return string
}

function make_url(url, name) {
	var data = {
		url: url,
		required_args: [],
		optional_groups: {}
	}

	data.string = replace_groups(url, data.optional_groups)
	data.string = replace_arguments(data.string, data)
	urls[name || url] = data
	return url
}

function reverse_url(url_name, args) {
	if (!args)
		args = {}
	var data = urls[url_name]
	if (!data)
		throw new Error('No url ' + url_name + ' was defined.')
	var string = reverse_groups(data.string, data.optional_groups, args)
	return rssi(string, {blank: true, noCache: true})(args)
}

module.exports = {
	url: make_url,
	reverse: reverse_url,
}