import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"
import dts from "vite-plugin-dts"

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: "src/core/index.ts",
				cli: "src/cli/index.ts",
				virtual: "src/virtual/index.ts",
			},
			formats: ["es"],
		},
		ssr: true,
		target: "node16",
		minify: true,
		rollupOptions: {},
	},
	plugins: [
		solidPlugin({
			ssr: true,
		}),
		// dts({
		// 	noEmitOnError: true,
		// 	skipDiagnostics: true,
		// }),
	],
})
