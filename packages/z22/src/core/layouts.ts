import { ViteDevServer } from "vite"
import { Z22Server } from "./server"
import fg from "fast-glob"
import path from "path"
import colors from "colors"
import { Component, JSX } from "solid-js"
import { logger } from "../utils/logger"
import { generateFuncToGetSimplifiedPathFromFilePath } from "../utils/path"

type LayoutComponent = Component<{ children: JSX.Element }>

export type Layout = {
	comp: LayoutComponent
	pages: Map<string, boolean>
}

export class LayoutManager {
	layouts: Record<string, Layout> = {}
	constructor() {}
}

const getLayoutNameFromFilePath = generateFuncToGetSimplifiedPathFromFilePath(
	"layouts",
	false
)

export const generateLayoutImportPath = (layoutName: string) => {
	return `virtual:z22/layout/${layoutName}`
}

export const startLayouting = async (
	cwd: string,
	viteServer: ViteDevServer,
	z22Server: Z22Server
) => {
	const layoutManager = new LayoutManager()
	const files = await fg("src/layouts/**/*.{ts,tsx}", { cwd })

	await Promise.all(
		files.map(async (filePathWithExt) => {
			const layoutName = getLayoutNameFromFilePath(filePathWithExt)
			if (!layoutName) return
			const layoutComp = (await viteServer.ssrLoadModule(filePathWithExt))
				.default as LayoutComponent

			layoutManager.layouts[layoutName] = {
				comp: layoutComp,
				pages: new Map(),
			}

			logger.info(
				colors.gray("New layout `") +
					colors.blue(colors.italic(layoutName)) +
					colors.gray("` added")
			)
		})
	)

	viteServer.watcher.on("change", async (p) => {
		const layoutName = getLayoutNameFromFilePath(p)

		if (layoutName) {
			const layoutComp = (await viteServer.ssrLoadModule(p))
				.default as LayoutComponent

			layoutManager.layouts[layoutName].comp = layoutComp
			layoutManager.layouts[layoutName].pages.forEach(
				(
					$$$$$$$$$$$$$ /** I don't know how to name this piece of shit */,
					pageFilePath
				) => {
					if ($$$$$$$$$$$$$) {
						viteServer.watcher.emit("change", pageFilePath)
					}
				}
			)
		}
	})

	return layoutManager
}
