import solidVitePlugin from "vite-plugin-solid"
import { Options } from "./types"

export const createVitePluginSolid = (Options: Options) =>
	solidVitePlugin({
		ssr: true,
		solid: {
			generate: "ssr",
		},
	})
