import solidVitePlugin from 'vite-plugin-solid'

export const createSolidVitePlugin = () => {
    return solidVitePlugin({
        ssr: true,
        solid: {
            generate: 'ssr'
        }
    })
}