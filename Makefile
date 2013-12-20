NODE_BIN ?= ./node_modules/.bin

all: lint test build

lint:
	$(NODE_BIN)/jshint index.js

build: components index.js
	@$(NODE_BIN)/component build --dev

components: component.json
	@$(NODE_BIN)/component install --dev

clean:
	rm -fr build components

test:
	$(NODE_BIN)/mocha --require should

.PHONY: clean lint test all
