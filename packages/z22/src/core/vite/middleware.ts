import { Plugin, ViteDevServer } from "vite"
import { Options } from "./types"

export const createVitePluginZ22Middleware = (options: Options): Plugin => {
	return {
		name: "z22-middleware",
		configureServer(viteServer) {
			return async () => {
				removeViteServerHtmlMiddlewares(viteServer.middlewares)
			}
		},
	}
}

const htmlMiddlewares = [
	"viteIndexHtmlMiddleware",
	"vite404Middleware",
	"viteSpaFallbackMiddleware",
	"viteHtmlFallbackMiddleware",
] as string[]

const removeViteServerHtmlMiddlewares = (server: ViteDevServer["middlewares"]) => {
	for (let i = server.stack.length - 1; i > 0; i--) {
		if (htmlMiddlewares.includes((server.stack[i].handle as Function).name)) {
			server.stack.splice(i, 1)
		}
	}
}
