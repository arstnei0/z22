import path from "path"
import { Plugin } from "vite"
import { Options } from "./types"

const VIRTUAL_MODULE_ID_PREFIX = "virtual:z22/"
const VIRTUAL_MODULE_ID_PREFIX_PROCESSED = `\0${VIRTUAL_MODULE_ID_PREFIX}`

export const createVitePluginZ22VirtualModules = (options: Options): Plugin => {
	return {
		name: "z22-virtual-module",
		enforce: "pre",
		resolveId(id) {
			if (id.startsWith(VIRTUAL_MODULE_ID_PREFIX)) {
				const p = id.slice(VIRTUAL_MODULE_ID_PREFIX.length)
				return path.resolve("node_modules/z22/src/virtual", p)
			}
		},
	}
}
