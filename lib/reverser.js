
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

function replace_groups(string) {
	var opt_groups = {}
	string.replace(group_regex, function(match, group){
		var groups = group_regex.exec(match)
		var replaced = replace_arguments(match)
		opt_groups[group] = {
			prefix: groups[0],
			suffix: groups[2],
			target: replaced
		}
		return '#{group_' + group + '}'
	})

	return opt_groups
}


function make_url(url, name) {
	var data = {
		url: url,
		required_args: [],
		optional_groups: {}
	}

	data.optional_groups = replace_groups(url)
	data.string = replace_arguments(url, data)
	console.log(data.string)
	data.fmt = rssi(data.string)
	urls[name || url] = data
	return url
}

function reverse_url(url_name, args) {
	if (!args)
		args = {};
	var data = urls[url_name]
	if (!data)
		throw new Error('No url ' + url_name + ' was defined.')
	var fmt = data.fmt
	var groups = {}
	for (var key in args) {
		if (key in data.optional_groups) {
			var group = data.optional_groups[key]
			groups['group_' + key] = group.prefix + group.target + group.suffix
		}
	}
	if (groups)
		fmt = rssi(fmt(groups))
	return rssi(fmt(args), {blank: true})()
}

module.exports = {
	url: make_url,
	reverse: reverse_url,
}