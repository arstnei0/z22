import VitePluginAutoImport from "unplugin-auto-import/vite"
import { OptionsI } from "../../../../core/options"

export const createAutoImportVitePlugin = (options: Options) =>
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
