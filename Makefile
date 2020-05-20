PROJECT=tweet-html
NODE_BIN=./node_modules/.bin

all: check compile

check: lint test

lint:
	$(NODE_BIN)/jshint index.js test

compile: build/build.js

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	$(NODE_BIN)/browserify --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

node_modules: package.json
	npm install

test: | node_modules
	$(NODE_BIN)/tape test/*.js | $(NODE_BIN)/tap-dot

clean:
	rm -fr build

distclean: clean
	rm -fr node_modules

.PHONY: clean distclean compile lint check all test
