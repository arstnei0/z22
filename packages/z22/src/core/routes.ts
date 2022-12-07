import fg from "fast-glob"
import colors from "colors"
import { ViteDevServer } from "vite"
import path from "path"
import { HTTPMethod } from "find-my-way"
import { httpMethods, Z22Server } from "./server"
import { logger } from "../utils/logger"
import { startLayouting } from "./layouts"

const addRoutesToZ22Server = (
	z22Server: Z22Server,
	routes: Record<HTTPMethod, any>,
	routePath: string
) => {
	Object.entries(routes).forEach(([method, handler]) => {
		z22Server.router.on(method as HTTPMethod, routePath, handler)
	})
}

const addRoutesFromModule = (
	module: Record<string, any>,
	routes: Record<HTTPMethod, any>
) => {
	Object.entries(module).forEach(([method, handler]) => {
		if (method === "default") routes["GET"] = handler
		else if (method in httpMethods) routes[method as HTTPMethod] = handler
	})
}

export const startRouting = async (workDir: string, viteServer: ViteDevServer, z22Server: Z22Server) => {
    const layouts = startLayouting(workDir, viteServer, z22Server)
	const files = await fg("src/routes/**/*.{ts,tsx}", {
		cwd: workDir,
	})

	files.forEach(async (filePath) => {
		let module = await viteServer.ssrLoadModule(filePath, {
			fixStacktrace: true,
		})

		const pathArray = filePath.split(path.sep)
		pathArray.splice(0, 2)
		const pathArraySliced = pathArray
			.map((p) => path.parse(p).name)
			.filter((p) => p != "index")

		const routePathWithExt = pathArraySliced.join(path.sep)
		const routePath = "/" + routePathWithExt

		let routes = {} as Record<HTTPMethod, any>

		addRoutesFromModule(module, routes)
		addRoutesToZ22Server(z22Server, routes, routePath)

		logger.info(
			colors.gray("New route `") +
				colors.italic(colors.blue(routePath)) +
				colors.gray("` added")
		)

		viteServer.watcher.on("change", async (dir) => {
			if (dir.endsWith(filePath)) {
				module = await viteServer.ssrLoadModule(filePath)
				z22Server.router.off(
					Object.keys(routes) as HTTPMethod[],
					routePath
				)
				routes = {} as Record<HTTPMethod, any>
				addRoutesFromModule(module, routes)

				addRoutesToZ22Server(z22Server, routes, routePath)

				logger.info(
					colors.gray("Route `") +
						colors.italic(colors.blue(routePath)) +
						colors.gray("` updated")
				)
			}
		})
	})
}
