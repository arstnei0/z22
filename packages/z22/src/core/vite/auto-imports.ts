import VitePluginAutoImport from "unplugin-auto-import/vite"
import { Options } from "./types"

export const createVitePluginAutoImport = (options: Options) =>
	VitePluginAutoImport({
		imports: [
			"solid-js",
			{
				z22: ["definePage"],
				zod: [["*", "z"]],
			},
		],
		dts: ".z22/auto-imports.d.ts",
	})
