all: install

install: yarn-install bootstrap compile

yarn-install:
	@yarn --silent install

bootstrap:
	@yarn --silent lerna bootstrap

compile:
	@yarn --silent lerna run tsc --stream

test: compile
	@yarn --silent test --runInBand --coverage

publish:
	@yarn --silent lerna publish

changed:
	@yarn --silent lerna changed

clean: clean-lib clean-modules clean-coverage clean-buildinfo

clean-modules:
	@rm -rf node_modules/
	@find packages/ -name node_modules -type d -exec rm -rf {} +

clean-lib:
	@find packages/ -name lib -type d -exec rm -rf {} +

clean-coverage:
	@rm -rf coverage/
	@find packages/ -name coverage -type d -exec rm -rf {} +

clean-buildinfo:
	@find packages/ -name tsconfig.tsbuildinfo -exec rm -rf {} +


.PHONY: all install test yarn-install compile bootstrap publish clean-buildinfo clean-modules clean-lib clean-coverage clean
