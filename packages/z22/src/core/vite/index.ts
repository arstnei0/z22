import { Plugin, ViteDevServer } from "vite"
import createVitePluginInspect from "vite-plugin-inspect"
import type { Logger } from "../../virtual/utils/logger"
import { colors } from "../utils/colors"
import { terminalLogo } from "../utils/logo"
import { createVitePluginAutoImport } from "./auto-imports"
import { createVitePluginZ22Config } from "./config"
import { createVitePluginZ22Middleware } from "./middleware"
import { createVitePluginZ22Router } from "./router"
import { createVitePluginZ22Server } from "./server"
import { createVitePluginSolid } from "./solid"
import { Options, OptionsI, OptionsV } from "./types"
import { createVitePluginZ22VirtualModules } from "./virtual"
import terminalLink from "terminal-link"

export type Context = {
	options: Options
	vite?: ViteDevServer
	logger?: Logger
}

export let context: Context

export const createZ22VitePlugin = (optionsI: OptionsI): Plugin[] => {
	const options = OptionsV.parse(optionsI) as Options

	context = { options }

	console.log(colors.rainbow(terminalLogo))

	return [
		{
			name: "z22-pre",
			enforce: "pre",
			async configureServer(vite) {
				context.vite = vite

				const { logger } = (await context.vite?.ssrLoadModule("#logger")) as {
					logger: Logger
				}

				context.logger = logger

				console.log(
					`Server started on ${colors.blue(
						terminalLink(
							`Port ${context.options.port}`,
							`http://${
								context.options.host === "0.0.0.0" &&
								context.options.mode === "development"
									? "localhost"
									: context.options.host
							}:${context.options.port}/`
						)
					)}!`
				)
			},
		},
		createVitePluginZ22Config(options),
		createVitePluginZ22VirtualModules(options),
		createVitePluginZ22Middleware(options),
		createVitePluginZ22Router(options),
		createVitePluginZ22Server(options),

		createVitePluginInspect(),
		createVitePluginAutoImport(options),
		createVitePluginSolid(options),
	]
}
