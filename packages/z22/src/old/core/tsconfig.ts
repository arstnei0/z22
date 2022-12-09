import fse from "fs-extra"
import path from "path"
import dedent from "dedent"

export const generateTsHelpers = async (dir: string) => {
	await fse.outputFile(
		path.join(dir, "tsconfig.json"),
		dedent`{
        "compilerOptions": {
            "baseUrl": "..",
            "paths": {
                "~": ["."]
            }
        },
        "include": [
            "./z22.d.ts",
            "../**/*"
        ]
    }`
	)

	await fse.outputFile(
		path.join(dir, "z22.d.ts"),
		dedent`
    /// <reference path="auto-imports.d.ts" />
    `
	)
}
