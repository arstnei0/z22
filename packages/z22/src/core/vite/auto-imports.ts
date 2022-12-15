import VitePluginAutoImport from "unplugin-auto-import/vite"
import { Options } from "./types.js"

export const createVitePluginAutoImport = (options: Options) =>
	VitePluginAutoImport({
		imports: [
			"solid-js",
			{
				z22: ["definePage", "defineEndpoint", "Handler"],
				zod: [["*", "z"]],
			},
		],
		dts: ".z22/auto-imports.d.ts",
	})
