import { Plugin } from "vite"
import { createVitePluginAutoImport } from "./auto-imports"
import { Options, OptionsI, OptionsV, Z22Program } from "./types"
import { createVitePluginSolid } from "./solid"
import { createVitePluginZ22Config } from "./config"
import createVitePluginInspect from 'vite-plugin-inspect'
import { createVitePluginZ22Middleware } from "./middleware"
import { createVitePluginZ22Router } from "./router"
import { createVitePluginZ22Server } from "./server"
import { createVitePluginZ22VirtualModules } from "./virtual"

export const createZ22VitePlugin = (optionsI: OptionsI): Plugin[] => {
    const options = OptionsV.parse(optionsI) as Options
    const server: Z22Program = { options }

    return [
        createVitePluginZ22Config(options),
        createVitePluginZ22VirtualModules(options),
        createVitePluginZ22Middleware(options),
        createVitePluginZ22Router(options),
        createVitePluginZ22Server(options),

        createVitePluginInspect(),
        createVitePluginAutoImport(options),
        createVitePluginSolid(options),
    ]
}