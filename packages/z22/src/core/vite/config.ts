import { mergeConfig, Plugin, UserConfig } from "vite"
import { Options } from "./types"

export const createVitePluginZ22Config = (options: Options): Plugin => {
	const env = {} as Record<string, any>

	env.PORT = options.port
	env.HOST = options.host
	env.DEV = options.mode === "development" ? true : false
	env.PROD = options.mode === "production" ? true : false
	env.MODE = options.mode

	const codeReplacements = Object.entries(env).reduce(
		(prev, curr) => ({
			...prev,
			[`$Z22$.env.${curr[0]}`]: JSON.stringify(curr[1]),
		}),
		{}
	)

	return {
		name: "z22-config",
		enforce: "pre",
		config(config, configEnv) {
			const isDev = options.mode === "development"

			const entryServer = "virtual:z22/build-entry.ts"

			const devConfig: UserConfig = isDev
				? {
						server: {
							port: options.port,
							host: options.host,
						},
						ssr: {
							external: ["find-my-way"],
						},
				  }
				: {}

			const buildConfig: UserConfig = isDev
				? {}
				: {
						build: {
							ssr: true,
							rollupOptions: {
								input: {
									server: entryServer,
								},
								output: {
									format: "esm",
								},
							},
						},
				  }

			return mergeConfig(
				buildConfig,
				mergeConfig(
					devConfig,
					mergeConfig(
						{
							mode: options.mode,
							resolve: {
								alias: {
									"#logger": "virtual:z22/utils/logger.ts",
								},
							},
						} as UserConfig,
						config
					)
				)
			)
		},
		transform(code, id) {
			return Object.entries(codeReplacements).reduce(
				(prev, curr) => (prev as any).replaceAll(curr[0], "3000"),
				code
			)
		},
	}
}
