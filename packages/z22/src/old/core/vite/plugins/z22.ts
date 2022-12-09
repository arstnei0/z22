import { Plugin } from "vite"
import fse from "fs-extra"
import { LayoutManager } from "../../layouts"
import path from "path"

export const virtualModuleId = "virtual:z22/"
const virtualModuleIdProcessed = `\0${virtualModuleId}`
const virtualModuleIdSliceLength = virtualModuleId.length
const virtualModuleIdSliceLengthProcessed = virtualModuleIdSliceLength + 1

const mapVirtualModuleIdToActualId = {
	"index.tsx": "index.tsx",
} as Record<string, string>

export let moduleNeededToBeUpdated = {} as Record<string, boolean>

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
		},
	]
}
