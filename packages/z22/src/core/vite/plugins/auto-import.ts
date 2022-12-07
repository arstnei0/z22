import VitePluginAutoImport from "unplugin-auto-import/vite"

export const createAutoImportVitePlugin = () =>
	VitePluginAutoImport({
		imports: [
			"solid-js",
			{
				z22: [
					"definePage"
				],
				zod: [["*", "z"]],
			},
		],
		dts: ".z22/auto-imports.d.ts",
	})
