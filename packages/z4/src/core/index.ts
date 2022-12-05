import { build, createServer, InlineConfig as ViteInlineConfig, loadConfigFromFile, loadEnv, mergeConfig } from "vite"
import z from 'zod'
import { Z4Error } from "../utils/index.js"
import { createAutoImportPlugin } from "./vite/plugins/auto-import.js"

export enum Mode {
    Development = 'development',
    Production = 'production'
}

const ModeV = z.nativeEnum(Mode)

export const run = async (mode: Mode) => {
    mode = ModeV.parse(mode)

    const workDir = process.cwd()
    const env = loadEnv(mode, workDir)

    let config: Awaited<ReturnType<typeof loadConfigFromFile>>

    try {
        config = await loadConfigFromFile({
            command: mode === Mode.Development ? 'serve' : 'build',
            mode, 
            ssrBuild: true
        }, 'z4.config.ts', workDir)
    } catch(e) {
        throw new Z4Error('Config file not found')
    }

    const globalViteConfig: ViteInlineConfig = {
        plugins: [
            createAutoImportPlugin(),
        ],
        
    }
    
    if (mode === Mode.Development) {
        const devViteConfig: ViteInlineConfig = {

        }

        const viteServer = await createServer(mergeConfig(globalViteConfig, devViteConfig))
    } else if (mode === Mode.Production) {
        const bulidViteConfig: ViteInlineConfig = {

        }
    
        build(mergeConfig(globalViteConfig, bulidViteConfig))
    }
}

