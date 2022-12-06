import { build } from "vite"
import solidPlugin from 'vite-plugin-solid'
import dts from 'vite-plugin-dts'

build({
    build: {
        lib: {
            entry: {
                server: './src/server/index.tsx'
            },
            formats: ['es']
        },
        watch: {}
    },
    plugins: [solidPlugin({
        ssr: true,
    })],
})

build({
    build: {
        lib: {
            entry: {
                client: './src/client/index.tsx'
            },
            formats: ['es']
        },
        watch: {}
    },
    plugins: [solidPlugin({
    })],
})