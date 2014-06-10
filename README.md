urlreverser
===========

Url reversing module for Node.

Inspired by django.

First urls must be passed to `url` function, then it can be reversed back.
Function `url` accept url and optional name. If name is not specified,
full url will be used as name for reverser. The original string will be
returned in `url` call.

Simple usage:

    var reverser = require('urlreverser')
    reverser.url('/foo/:bar?', 'bar_url')
    // -> '/foo/:bar?'
    reverser.reverse('bar_url', {bar: 'baz'})
    // -> '/foo/baz'
    reverser.reverse('bar_url')
    // -> '/foo/'

Possibly ommited groups is also supported:

    reverser.url('/foo(?:/bar/:baz)?', 'baz')
    // -> '/foo/(?:/bar/:baz)'
    reverser.reverse('baz', {baz: 'baz'})
    // -> '/foo/bar/baz'
    reverser.reverse('baz')
    // -> '/foo'


Templates support
------

nunjucks:

	var env = new nunjucks.Environment()
    reverser.nunjucks(env)
    reverser.url('/foo/:bar', 'bar')
    env.renderString("{% url 'bar', bar='baz' %}")
    // -> '/foo/baz'

