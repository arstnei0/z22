import { mergeConfig, Plugin, UserConfig } from "vite"
import { Options } from "./types"

export const createVitePluginZ22Config = (options: Options): Plugin => {
	const env = {} as Record<string, any>

	env.PORT = options.port

	const codeReplacements = Object.entries(env).reduce(
		(prev, curr) => ({
			...prev,
			[`$Z22$.${curr[0]}`]: curr[1],
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
							// define: Object.entries(env).reduce(
							// 	(prev, curr) => ({
							// 		...prev,
							// 		[`import.meta.env.${curr[0]}`]: curr[1],
							// 	}),
							// 	{}
							// ),
						} as UserConfig,
						config
					)
				)
			)
		},
		transform(code, id) {
			return Object.entries(codeReplacements).reduce(
				(prev, curr) => (prev as any).replace(curr[0], '3000'),
				code
			)
		},
	}
}
