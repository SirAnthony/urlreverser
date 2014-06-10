jshint = node_modules/.bin/jshint
mocha = node_modules/.bin/mocha
uglifyjs = node_modules/.bin/uglifyjs
npm = npm
git = git

all: jshint mocha

node_modules: package.json
	@ $(npm) install

jshint: node_modules
	@ $(jshint) urlreverser.js lib/*.js test/*.js

mocha: node_modules
	@ $(mocha) -R spec

clean:
	@ $(git) clean -dfx
