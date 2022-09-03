# Reset
Color_Off=\033[0m

# Regular Colors
Red=\033[0;31m
Dim=\033[0;2m
Green=\033[0;32m

define error_output
	@echo -e "${Red}error${Color_Off}:" "$1 $2 $3 $4 $5 $6 $7 $8 $9" >&2
endef

define info_output
	@echo -e "${Dim}info${Color_Off}:" "$1 $2 $3 $4 $5 $6 $7 $8 $9" >&2
endef

define success_output
	@echo -e "${Green}info${Color_Off}:" "$1 $2 $3 $4 $5 $6 $7 $8 $9" >&2
endef

init:
	@git submodule update --init --recursive

build: build-injector build-installer build-hykord

build-installer:
	$(call info_output,Building installer)
	$(eval FIRST := $(shell date +%Y%m%d%H%M%S))
	@cd packages/installer/ && zig build
	$(eval SECOND := $(shell date +%Y%m%d%H%M%S))
	$(eval NOW := $(shell ./scripts/timestamp.sh ${FIRST} ${SECOND}))

	$(call success_output,Installer builded in ${NOW} ms)

build-injector:
	$(call info_output,Building injector)
	$(eval FIRST := $(shell date +%Y%m%d%H%M%S))
	@cd packages/injector/ && zig build
	$(eval SECOND := $(shell date +%Y%m%d%H%M%S))
	$(eval NOW := $(shell ./scripts/timestamp.sh ${FIRST} ${SECOND}))

	$(call success_output,Injector builded in ${NOW} ms)

build-hykord: build-hykord-dependencies
	$(call info_output,Building hykord)
	$(eval FIRST := $(shell date +%Y%m%d%H%M%S))
	@cd packages/hykord/ && bun install && bun run build
	$(eval SECOND := $(shell date +%Y%m%d%H%M%S))
	$(eval NOW := $(shell ./scripts/timestamp.sh ${FIRST} ${SECOND}))

	$(call success_output,Hykord builded in ${NOW} ms)

build-hykord-dependencies:
	@cd packages/hykord/src/dependencies/spitroast && bun install && bun run prepublish
	@cd packages/hykord/src/dependencies/websmack && bun install && bun run prepublish

build-loaders:
	@cd packages/loaders && ./build.sh


run-injector: build-injector
	@cd packages/injector/ && ./zig-out/bin/injector

run-injector-inject: build-injector
	@cd packages/injector/ && sudo ./zig-out/bin/injector inject development $(shell pwd)/packages/hykord/dist/index.js

run-injector-uninject: build-injector
	@cd packages/injector/ && sudo ./zig-out/bin/injector uninject development

run-installer: build-installer
	@cd packages/installer/ && ./zig-out/bin/installer

lint:
	@cd packages/injector && zig fmt src/main.zig
	@cd packages/installer && zig fmt src/main.zig
	@cd packages/utils && zig fmt src/main.zig
	@bun run lint && bun run format