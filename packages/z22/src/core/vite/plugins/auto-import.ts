import VitePluginAutoImport from "unplugin-auto-import/vite"

export const createAutoImportVitePlugin = () =>
	VitePluginAutoImport({
		imports: [
			"solid-js",
			{
				"virtual:z22/definePage.tsx": ["definePage"],
				zod: [["*", "z"]],
			},
		],
		dts: ".z22/auto-imports.d.ts",
	})
