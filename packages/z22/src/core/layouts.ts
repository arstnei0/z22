import { ViteDevServer } from "vite"
import { Z22Server } from "./server"
import fg from "fast-glob"
import path from "path"
import colors from 'colors'
import { Component } from "solid-js"
import { logger } from "../utils/logger"

export type Layout = Component

export class LayoutManager {
	layouts: Record<string, Layout> = {}
	constructor() {}
}

export const startLayouting = async (
	cwd: string,
	viteServer: ViteDevServer,
	z22Server: Z22Server
) => {
	const layoutManager = new LayoutManager()
	const files = await fg("src/layouts/**/*.{ts,tsx}", { cwd })

	files.forEach(async (filePathWithExt) => {
		const filePathParsed = path.parse(filePathWithExt)
		const filePath = filePathParsed.dir + path.sep + filePathParsed.name
		const filePathArray = filePath.split(path.sep)
		filePathArray.splice(0, 2)
		const layoutName = filePathArray.join(filePathArray.join("/"))

		const layout = (await viteServer.ssrLoadModule(filePathWithExt))
			.default as Layout

		layoutManager.layouts[layoutName] = layout

        logger.info(colors.gray('New layout `') + colors.blue(colors.italic(layoutName)) + colors.gray('` added'))
	})

    // viteServer.watcher.on('')

	return layoutManager
}
