import { Plugin } from "vite"
import { Options } from "./types"

export const createVitePluginZ22Server = (options: Options): Plugin => {
	return {
		name: "z22-server",
		configureServer(viteServer) {
			return async () =>
				viteServer.middlewares.use(async (req, res, next) => {
					const handler = (await viteServer.ssrLoadModule("virtual:z22/entry-server.tsx"))
						.httpHandler
					handler(req, res)
				})
		},
	}
}
