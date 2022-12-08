import { ViteDevServer } from "vite"
import { Z22Server } from "./server"
import fg from "fast-glob"
import path from "path"
import colors from "colors"
import { Component } from "solid-js"
import { logger } from "../utils/logger"

type LayoutComp = Component

export type Layout = {
	comp: LayoutComp
	sourceFilePath: string
}

export class LayoutManager {
	layouts: Record<string, Layout> = {}
	constructor() {}
}

const getLayoutNameFromFilePath = (filePathWithExt: string) => {
	const filePathParsed = path.parse(filePathWithExt)
	const filePath = filePathParsed.dir + path.sep + filePathParsed.name
	const filePathArray = filePath.split(path.sep)
	filePathArray.splice(0, 2)
	const layoutName = filePathArray.join(filePathArray.join("/"))
	return layoutName
}

export const startLayouting = async (
	cwd: string,
	viteServer: ViteDevServer,
	z22Server: Z22Server
) => {
	const layoutManager = new LayoutManager()
	const files = await fg("src/layouts/**/*.{ts,tsx}", { cwd })

	await Promise.all(files.map(async (filePathWithExt) => {
		const layoutName = getLayoutNameFromFilePath(filePathWithExt)
		const layoutComp = (await viteServer.ssrLoadModule(filePathWithExt))
			.default as LayoutComp

		layoutManager.layouts[layoutName] = {
			comp: layoutComp,
			sourceFilePath: filePathWithExt,
		}

		logger.info(
			colors.gray("New layout `") +
				colors.blue(colors.italic(layoutName)) +
				colors.gray("` added")
		)
	}))

	viteServer.watcher.on("change", (p) => {
		const layoutName = getLayoutNameFromFilePath(p)

		console.log(layoutManager)
	})

	return layoutManager
}
