all: install

install: install-root install-packages build

install-root:
	@yarn --silent install

install-packages:
	@yarn --silent lerna bootstrap

build:
	@yarn --silent lerna run build --stream

test: build test-only

test-only:
	@yarn --silent test --runInBand --coverage

test-local:
	@yarn --silent test --coverage

package-install:
	@yarn --silent lerna bootstrap --scope @ohoareau/$(p)

package-build:
	@cd packages/$(p) && yarn --silent build

package-test: package-build
	@cd packages/$(p) && yarn --silent test --coverage --detectOpenHandles

package-clear-test:
	@cd packages/$(p) && yarn --silent jest --clearCache

package-storybook:
	@cd packages/$(p) && yarn --silent story

publish:
	@yarn --silent lerna publish

changed:
	@yarn --silent lerna changed

pr:
	@hub pull-request -b master

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

microgen-fixture-gen:
	@cd packages/microgen && yarn --silent gen __fixtures__/$(f).js ../../generated/$(f)

microgen-fixture-gen-js-lambda:
	@cd packages/microgen-plugin-js-lambda && yarn --silent gen __fixtures__/$(f).js ../../generated/$(f)

.PHONY: all install install-root install-packages test build publish microgen-example-gen clean-buildinfo clean-modules clean-lib clean-coverage clean package-build package-install package-storybook package-test pr
