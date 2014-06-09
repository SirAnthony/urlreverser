jshint = node_modules/.bin/jshint
mocha = node_modules/.bin/mocha
browserify = node_modules/.bin/browserify
bower = node_modules/.bin/bower
uglifyjs = node_modules/.bin/uglifyjs
test_min = ./test_min.sh
npm = npm
git = git

all: jshint mocha test_client/assert.js bower_components

min: urlreverser.min.js test_min

node_modules: package.json
	@ $(npm) install

jshint: node_modules
	@ $(jshint) urlreverser.js test/*.js

mocha: node_modules
	@ $(mocha) -R spec

test_client/assert.js: node_modules
	@ $(browserify) -r assert -s assert -o $@

urlreverser.min.js: node_modules urlreverser.js
	@ $(uglifyjs) urlreverser.js -c -m -o urlreverser.min.js

test_min: node_modules urlreverser.min.js
	@ $(test_min)

clean:
	@ $(git) clean -dfx
