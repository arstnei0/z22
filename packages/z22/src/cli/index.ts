import * as process from "node:process"
import sade from "sade"
import * as vite from "vite"
import { createZ22VitePlugin } from "../core"

export default () => {
	const p = sade("z22")

	p.command("dev", "Start the dev server", {
		default: true,
	})
		.option("-p, --port", "The port of the dev server")
		.action(async (options) => {
			const viteSerer = await vite.createServer({
				plugins: [
					createZ22VitePlugin({
						mode: "development",
						...(options.port && {
							port: options.port as number,
						}),
					}),
				],
			})

            viteSerer.listen()
		})

	p.command("build", "Build the application").action(() => {
		vite.build({
			plugins: [createZ22VitePlugin({ mode: "production" })],
		})
	})

	p.parse(process.argv)
}
