import { defineConfig } from "vite"
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
	build: {
		lib: {
			entry: {
				index: "src/core/index.ts",
				cli: "src/cli/index.ts",
			},
			formats: ["es"],
		},
		ssr: true,
		target: "node14",
		minify: true,
		rollupOptions: {},
	},
	plugins: [
		solidPlugin({
			ssr: true,
		}),
	],
	ssr: {},
})
