var assert = require('assert'),
    nunjucks = require('nunjucks'),
    reverser = require('../urlreverser')

describe('urlreverser', function () {
    function eq(a, b) { assert.strictEqual(a, b) }
    function noeq(a, b) { assert.notEqual(a, b) }

    it('should return same url', function () {
        var url = '(?:/base/:base?)/(?:/base2/:base2?)/?f=:link'
        eq(reverser.url(url), url)
    })

    it('should work without name', function() {
        reverser.url('/foo/:bar')
        eq(reverser.reverse('/foo/:bar', {bar: 'bar'}), '/foo/bar')
    })

    it('should work with php links', function() {
        reverser.url('/link/?q=:q(?:&v=:v)?', 'link')
        eq(reverser.reverse('link', {q: 's', v: '1'}), '/link/?q=s&v=1')
    })

    it('should reverse simple url', function () {
        reverser.url('/foo', 'foo')
        eq(reverser.reverse('foo'), '/foo')

        reverser.url('/foo/:bar', 'bar')
        eq(reverser.reverse('bar', {bar: 'bar'}), '/foo/bar')
    })

    it('should reverse without parameters', function () {
        reverser.url('/foo/:baz?', 'baz')
        eq(reverser.reverse('baz'), '/foo/')
    })

    it('should omit groups', function () {
        reverser.url('/group(?:/foo/:bar)?', 'group')
        eq(reverser.reverse('group', {bar: 'a'}), '/group/foo/a')
        eq(reverser.reverse('group'), '/group')
    })

    it('should provide template to nunjucks', function () {
        var env = new nunjucks.Environment()
        reverser.nunjucks(env)
        reverser.url('/foo/:bar', 'bar')
        eq(env.renderString("{% url 'bar', bar='baz' %}"), '/foo/baz')
    })
})
