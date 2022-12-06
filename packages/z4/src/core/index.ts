import {
	build,
	createServer,
	InlineConfig as ViteInlineConfig,
	loadConfigFromFile,
	loadEnv,
	mergeConfig,
} from "vite"
import z from "zod"
import { createZ4Server, httpMethods } from "./server/index.js"
import { Z4Error } from "../utils/index.js"
import { createAutoImportVitePlugin } from "./vite/plugins/auto-import.js"
import fse from "fs-extra"
import path from "path"
import { createSolidVitePlugin } from "./vite/plugins/solid.js"
import fg from "fast-glob"
import { IncomingMessage, ServerResponse } from "http"
import { HTTPMethod } from "find-my-way"

export enum Mode {
	Development = "development",
	Production = "production",
}

const ModeV = z.nativeEnum(Mode)

const ConfigV = z.object({
	server: z
		.object({
			port: z.number().optional(),
		})
		.optional(),
})

const ensureAndClearZ4Directory = async (dir: string) => {
	await fse.ensureDir(dir)
	await fse.emptyDir(dir)
}

export const run = async (mode: Mode) => {
	mode = ModeV.parse(mode)

	const workDir = process.cwd()
	const z4Dir = path.join(workDir, ".z4")
	const env = loadEnv(mode, workDir)

	let configFile: Awaited<ReturnType<typeof loadConfigFromFile>>

	try {
		configFile = await loadConfigFromFile(
			{
				command: mode === Mode.Development ? "serve" : "build",
				mode,
				ssrBuild: true,
			},
			"z4.config.ts",
			workDir
		)
	} catch (e) {
		throw new Z4Error("Config file not found")
	}

	const config = ConfigV.parse(configFile?.config)

	const globalViteConfig: ViteInlineConfig = {
		plugins: [createAutoImportVitePlugin(), createSolidVitePlugin()],
	}

	await ensureAndClearZ4Directory(z4Dir)

	if (mode === Mode.Development) {
		const devViteConfig: ViteInlineConfig = {
			server: {
				middlewareMode: true,
			},
		}

		const viteServer = await createServer(
			mergeConfig(globalViteConfig, devViteConfig)
		)

		const z4Server = createZ4Server({
			port: config.server?.port,
			wrappers: (internal) => [
				...internal,
				viteServer.middlewares.handle,
			],
		})

		z4Server.start()

		const glob = await fg("src/routes/**/*.ts", {
			cwd: workDir,
		})

		glob.forEach(async (filePath) => {
			const module = await viteServer.ssrLoadModule(filePath)

			const pathArray = filePath.split(path.sep)
			pathArray.splice(0, 2)
			const pathArraySliced = pathArray
				.map((p) =>
					p.includes(".") ? p.substring(0, p.lastIndexOf(".")) : p
				)
				.filter((p) => p != "index")

			const routePathWithExt = pathArraySliced.join(path.sep)
			const routePath = "/" + routePathWithExt

			Reflect.ownKeys(module).forEach((method) => {
				if (method === "default")
					z4Server.router.on("GET", routePath, module.default)
				if (method in httpMethods)
					z4Server.router.on(
						method as HTTPMethod,
						routePath,
						Reflect.get(module, method)
					)
			})
		})
	} else if (mode === Mode.Production) {
		const bulidViteConfig: ViteInlineConfig = {}

		build(mergeConfig(globalViteConfig, bulidViteConfig))
	}
}

export { Handler } from './server/index.js'