import VitePluginAutoImport from "unplugin-auto-import/vite"

export const createAutoImportVitePlugin = () =>
	VitePluginAutoImport({
		imports: [
			"solid-js",
			{
				z4: [],
				zod: [["*", "z"]],
			},
		],
		dts: ".z4/auto-imports.d.ts",
	})
