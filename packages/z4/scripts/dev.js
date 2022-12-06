import { build } from "tsup"

build({
	watch: true,
	entry: {
		cli: "src/cli/index.ts",
	},
	dts: true,
	format: ["esm"],
	minify: false,
})

build({
	watch: true,
	entry: {
		server: "src/core/index.ts",
	},
	dts: true,
	format: ["esm"],
	minify: false,
})
