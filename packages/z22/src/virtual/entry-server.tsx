import { IncomingMessage, ServerResponse } from "http"
import { routes } from "./router.js"
import fmw, { HTTPMethod } from "find-my-way"
import { ApiMethod, Handler } from "../core/router/index.js"
import { getBody } from "./utils/body.js"

const router = fmw()

Object.entries(routes).forEach(([id, route]) => {
	;(Object.entries(route) as [ApiMethod, Handler][]).forEach(async ([method, handle]) => {
		router.on(method as HTTPMethod, id, (req, res) => {
			Handler.match(handle, {
				async fetch(handler) {
					const addition = {} as {
						body?: any
					}
					if (req.method === "POST") {
						addition.body = await getBody(req)
					}

					const headers = new Headers()
					for (let key in req.headers) {
						if (req.headers[key]) headers.append(key, req.headers[key] as string)
					}

					const request = new Request(new URL(req.url ?? "/", "http://localhost:3000/"), {
						method: method,
						headers,
						...addition,
					})

					{
						const response = await Promise.resolve(handler(request))

						for (let key in response.headers) {
							const header = response.headers.get(key)
							if (header) res.setHeader(key, header)
						}

						if (response.status && response.statusText)
							res.writeHead(response.status, response.statusText)
						res.write(await response.text())
						res.end()
					}
				},
				async stream(handler) {
					handler({ req, res })
				},
			})
		})
	})
})

export const httpHandler = (req: IncomingMessage, res: ServerResponse) => {
	router.lookup(req, res)
}
