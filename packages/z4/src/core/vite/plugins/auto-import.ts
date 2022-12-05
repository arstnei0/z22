import VitePluginAutoImport from 'unplugin-auto-import/vite'

export const createAutoImportPlugin = () => (
    VitePluginAutoImport({
        imports: [
            'solid-js',
            {
                z4: [
                    
                ],
                zod: [
                    'default', 'z'
                ]
            }
        ]
    })
)