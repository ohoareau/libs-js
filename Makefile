all: install

install: yarn-install bootstrap build

yarn-install:
	@yarn --silent install

bootstrap:
	@yarn --silent lerna bootstrap

build:
	@yarn --silent lerna run build --stream

test: build
	@yarn --silent test --runInBand --coverage

build-package:
	@cd packages/$(package) && yarn --silent build

story-package:
	@cd packages/$(package) && yarn --silent story

test-package: build-package
	@cd packages/$(package) && yarn --silent test --coverage --detectOpenHandles

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

.PHONY: all install test yarn-install build bootstrap publish clean-buildinfo clean-modules clean-lib clean-coverage clean
