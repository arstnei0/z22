import {
	build,
	createServer,
	InlineConfig as ViteInlineConfig,
	loadConfigFromFile,
	loadEnv,
	mergeConfig,
} from "vite"
import z from "zod"
import { createZ22Server, httpMethods, Z22Server } from "./server/index"
import { Z22Error } from "../utils/index"
import { createAutoImportVitePlugin } from "./vite/plugins/auto-import"
import fse from "fs-extra"
import path from "path"
import { createSolidVitePlugin } from "./vite/plugins/solid"
import { HTTPMethod } from "find-my-way"
import { generateTsHelpers } from "./tsconfig"
import {
	DEV_LOGGER_CONFIG,
	logger,
	PROD_LOGGER_CONFIG,
	setLogger,
} from "../utils/logger"
import PinoPretty from "pino-pretty"
import pino from "pino"
import { startRouting } from "./routes"
import figlet from 'figlet'

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

const ensureAndClearZ22Directory = async (dir: string) => {
	await fse.ensureDir(dir)
	await fse.emptyDir(dir)
}

export const run = async (mode: Mode) => {
	mode = ModeV.parse(mode)

	const cwd = process.cwd()
	const z22Dir = path.join(cwd, ".z22")
	const env = loadEnv(mode, cwd)

	let configFile: Awaited<ReturnType<typeof loadConfigFromFile>>

	try {
		configFile = await loadConfigFromFile(
			{
				command: mode === Mode.Development ? "serve" : "build",
				mode,
				ssrBuild: true,
			},
			"z22.config.ts",
			cwd
		)
	} catch (e) {
		throw new Z22Error("Config file not found")
	}

	const config = ConfigV.parse(configFile?.config)

	await ensureAndClearZ22Directory(z22Dir)

	await generateTsHelpers(path.join(cwd, ".z22"))

	const globalViteConfig: ViteInlineConfig = {
		plugins: [createAutoImportVitePlugin(), createSolidVitePlugin()],
		ssr: {
			external: ["z22"],
		},
	}

	const isDev = mode === Mode.Development

	const loggerConfig = isDev ? DEV_LOGGER_CONFIG : PROD_LOGGER_CONFIG
	const loggerStream = PinoPretty(loggerConfig)
	setLogger(pino(loggerStream))

	if (isDev) {
		console.log(figlet.textSync('Z22', {
			font: 'Ghost',
			width: 800
		}))

		const devViteConfig: ViteInlineConfig = {
			server: {
				middlewareMode: true,
			},
			appType: "custom",
			logLevel: "error",
		}

		const viteServer = await createServer(
			mergeConfig(globalViteConfig, devViteConfig)
		)

		const z22Server = createZ22Server({
			port: config.server?.port,
			wrappers: (internal) => [
				...internal,
				viteServer.middlewares.handle,
			],
		})

		z22Server.start()

		startRouting(cwd, viteServer, z22Server)
	} else if (mode === Mode.Production) {
		const bulidViteConfig: ViteInlineConfig = {}

		build(mergeConfig(globalViteConfig, bulidViteConfig))
	}
}

export type { HttpHandler } from "./server"
export { definePage } from "./ssr"
