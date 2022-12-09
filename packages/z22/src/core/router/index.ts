import { IncomingMessage, ServerResponse } from "http"
import path from "path"
import { z } from "zod"

export type Route = {
	id: string
	path: string
	api: Partial<Record<ApiMethod, string>>
}

const API_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]
const ApiMethodV = z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"])
export type ApiMethod = z.infer<typeof ApiMethodV>

export type Handler = (req: IncomingMessage, res: ServerResponse) => any | Promise<any>

export class Router {
	routes: Map<string, Route> = new Map()
	constructor() {
		this.routes.set("/", {
			id: "/",
			path: "/src/routes/index.tsx",
			api: {
				GET: "/src/routes/index.tsx",
			},
		})
	}

	stringifyRoutes(outputName: string) {
		const jsCode = jsFactory()

		const r = [...this.routes.values()]

		const code =
			`{\n\t` +
			r
				.map(
					(i) =>
						`"${i.id}": {\n\t\t${[
							...API_METHODS.filter(
								(j) => i.api[j as ApiMethod]
							).map(
								(v) =>
									`${v}: ${jsCode.addNamedImport(
										v,
										path.posix.resolve((i.api as any)[v])
									)}`
							),
						]
							.filter(Boolean)
							.join(",\n\t\t ")} \n\t}`
				)
				.join(",\n") +
			`\n}`

		const text = `
${jsCode.getImportStatements()}
const ${outputName} = ${code};`

		return text
	}
}

function jsFactory() {
	let imports = new Map<string, any>()
	let vars = 0

	function addImport(p: string) {
		let id = imports.get(p)
		if (!id) {
			id = {}
			imports.set(p, id)
		}

		let d = "import" + vars++
		id["default"] = d
		return d
	}

	function addNamedImport(name: string, p: string) {
		let id = imports.get(p)
		if (!id) {
			id = {}
			imports.set(p, id)
		}

		let d = "namedImport" + vars++
		id[name] = d
		return d
	}

	const getNamedExport = (p: string) => {
		let id = imports.get(p)

		delete id["default"]

		return Object.keys(id).length > 0
			? `{ ${Object.keys(id)
					.map((k) => `${k} as ${id[k]}`)
					.join(", ")} }`
			: ""
	}

	const getImportStatements = () => {
		return `${[...imports.keys()]
			.map(
				(i) =>
					`import ${
						imports.get(i).default
							? `${imports.get(i).default}${
									Object.keys(imports.get(i)).length > 1
										? ", "
										: ""
							  }`
							: ""
					} ${getNamedExport(i)} from '${i}';`
			)
			.join("\n")}`
	}

	return {
		addImport,
		addNamedImport,
		getImportStatements,
	}
}
