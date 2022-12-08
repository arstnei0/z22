import { Plugin } from "vite"
import fse from "fs-extra"
import { LayoutManager } from "../../layouts"
import path from "path"

export const virtualModuleId = "virtual:z22/"
const virtualModuleIdProcessed = `\0${virtualModuleId}`
const virtualModuleIdSliceLength = virtualModuleId.length
const virtualModuleIdSliceLengthProcessed = virtualModuleIdSliceLength + 1

const mapVirtualModuleIdToActualId = {
	"definePage.tsx": "definePage.tsx",
} as Record<string, string>

export const createZ22VitePlugin = (
	cwd: string
): [(_: LayoutManager) => void, Plugin] => {
	let layoutMaganger: LayoutManager
	return [
		(_: LayoutManager) => {
			layoutMaganger = _
		},
		{
			name: "z22",
			resolveId(idUnprocessed) {
				if (idUnprocessed.startsWith(virtualModuleId)) {
					const id = idUnprocessed.slice(
						virtualModuleIdSliceLength,
						10000
					)

					if (id.startsWith("layout/")) {
						const layoutId = id.slice(7, 10000)
						const layout = layoutMaganger.layouts?.[layoutId]
						if (layout)
							return path.resolve(cwd, layout.sourceFilePath)
					}

					return `\0${idUnprocessed}`
				}
			},
			load(idUnprocessed) {
				if (idUnprocessed.startsWith(virtualModuleIdProcessed)) {
					const id = idUnprocessed.slice(
						virtualModuleIdSliceLengthProcessed,
						10000
					)
					if (mapVirtualModuleIdToActualId[id])
						return fse
							.readFileSync(
								"node_modules/z22/templates/" +
									mapVirtualModuleIdToActualId[id]
							)
							.toString()
				}
			},
		},
	]
}
