import { Plugin } from "vite"
import { Router } from "../router"
import { Options } from "./types"

const ROUTES_STATEMENT = `const _routes = __ROUTES__`

export const createVitePluginZ22Router = (options: Options): Plugin => {
    const router = new Router()

	return {
		name: "z22-fs-router",
		transform(code, id, transformOptions) {
			if (code.includes(ROUTES_STATEMENT)) {
                return {
                    code: code.replace(ROUTES_STATEMENT, router.stringifyRoutes('_routes'))
                }
            }
		},
	}
}
