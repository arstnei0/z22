import path from "path"

export const generateFuncToGetSimplifiedPathFromFilePath = (
	name: string,
	addSlashInTheFront: boolean
) => {
	return (filePath: string) => {
		const pathArray = filePath.split(path.sep)
		const indexOfSrc = pathArray.indexOf("src")
		const indexOfTheName = pathArray.indexOf(name)
		if (indexOfSrc + 1 !== indexOfTheName) return

		pathArray.splice(0, indexOfTheName + 1)
		const pathArraySliced = pathArray
			.map((p) => path.parse(p).name)
			.filter((p) => p != "index")

		const pathWithExt = pathArraySliced.join("/")

		return addSlashInTheFront ? "/" + pathWithExt : pathWithExt
	}
}
