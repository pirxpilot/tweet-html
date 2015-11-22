PROJECT=tweet-html

all: check compile

check: lint

lint:
	jshint index.js test

compile: build/build.js

build:
	mkdir -p $@

build/build.js: node_modules index.js | build
	browserify --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

node_modules: package.json
	npm install

clean:
	rm -fr build

distclean: clean
	rm -fr node_modules

.PHONY: clean distclean compile lint check all
