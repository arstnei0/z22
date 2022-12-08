import fg from "fast-glob"
import colors from "colors"
import { ViteDevServer } from "vite"
import path from "path"
import { HTTPMethod } from "find-my-way"
import { httpMethods, Z22Server } from "./server"
import { logger } from "../utils/logger"
import { LayoutManager, startLayouting } from "./layouts"
import { Z22Error } from "../utils"
import { generateFuncToGetSimplifiedPathFromFilePath } from "../utils/path"

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

const routePathIdentifier = `src${path.sep}routes`

const getRoutePathFromFilePath = generateFuncToGetSimplifiedPathFromFilePath(
	"routes",
	true
)

export let workingPagePath: string

export const startRouting = async (
	cwd: string,
	viteServer: ViteDevServer,
	z22Server: Z22Server,
	setLayoutManager: (layoutManager: LayoutManager) => void
) => {
	const fileToRoutes = new Map<string, Record<HTTPMethod, any>>()

	const layoutManager = await startLayouting(cwd, viteServer, z22Server)
	setLayoutManager(layoutManager)
	const files = await fg("src/routes/**/*.{ts,tsx}", {
		cwd: cwd,
	})

	const addFile = async (filePath: string) => {
		const routePath = getRoutePathFromFilePath(filePath)
		if (!routePath) return

		workingPagePath = filePath

		let module = await viteServer.ssrLoadModule(filePath, {
			fixStacktrace: true,
		})

		let routes = {} as Record<HTTPMethod, any>

		addRoutesFromModule(module, routes)
		addRoutesToZ22Server(z22Server, routes, routePath)

		fileToRoutes.set(routePath, routes)

		logger.info(
			colors.gray("New route `") +
				colors.italic(colors.blue(routePath)) +
				colors.gray("` added")
		)

		workingPagePath = ""
	}

	for (let filePath of files) {
		await addFile(filePath)
	}

	viteServer.watcher.on("add", async (path) => {
		await addFile(path)
	})

	viteServer.watcher.on("change", async (p) => {
		const routePath = getRoutePathFromFilePath(p)
		if (!routePath) return

		fileToRoutes.forEach(async (routes, rp) => {
			if (routePath === rp) {
				z22Server.router.off(
					Object.keys(routes) as HTTPMethod[],
					routePath
				)

				await addFile(p)
			}
		})
	})

	viteServer.watcher.on("unlink", async (filePath) => {
		const routePath = getRoutePathFromFilePath(filePath)
		if (!routePath) return

		const routes = fileToRoutes.get(routePath)
		if (!routes) return

		z22Server.router.off(Object.keys(routes) as HTTPMethod[], routePath)
	})
}
