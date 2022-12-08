import z from "zod"
import {
	createServer as createHttpServer,
	IncomingMessage,
	ServerResponse,
} from "http"
import { createRouter } from "./router.js"
import Router, { HTTPMethod } from "find-my-way"

const WrapperV =
	z.custom<
		(req: IncomingMessage, res: ServerResponse, next: () => void) => void
	>()
type Wrapper = z.infer<typeof WrapperV>

const OptionsV = z.object({
	port: z.number().default(3000),
	wrappers: z.function(
		z.tuple([z.array(WrapperV)]),
		z.array(WrapperV).default([])
	),
})

type OptionsI = z.input<typeof OptionsV>
type Options = z.output<typeof OptionsV>

export type HttpHandler = (req: IncomingMessage, res: ServerResponse) => void

export const httpMethods = [
	"ACL",
	"BIND",
	"CHECKOUT",
	"CONNECT",
	"COPY",
	"DELETE",
	"GET",
	"HEAD",
	"LINK",
	"LOCK",
	"M-SEARCH",
	"MERGE",
	"MKACTIVITY",
	"MKCALENDAR",
	"MKCOL",
	"MOVE",
	"NOTIFY",
	"OPTIONS",
	"PATCH",
	"POST",
	"PROPFIND",
	"PROPPATCH",
	"PURGE",
	"PUT",
	"REBIND",
	"REPORT",
	"SEARCH",
	"SOURCE",
	"SUBSCRIBE",
	"TRACE",
	"UNBIND",
	"UNLINK",
	"UNLOCK",
	"UNSUBSCRIBE",
] as HTTPMethod[]

const runWrapper =
	<T>(
		wrappers: Wrapper[],
		index: number,
		stopIndex: number,
		req: IncomingMessage,
		res: ServerResponse
	): (() => void) =>
	() => {
		return void wrappers[index](
			req,
			res,
			index < stopIndex
				? runWrapper(wrappers, index + 1, stopIndex, req, res)
				: () => undefined
		)
	}

export const createZ22Server = (optionsI: OptionsI) => {
	const options = OptionsV.parse(optionsI) as Options

	const router = createRouter()

	const wrappers = options.wrappers([
		(req, res, next) => {
			if (!req.url || !req.method) return next()
			router.lookup(req, res, (err: Error) => {})
		},
	])
	const httpServer = createHttpServer((req, res) => {
		if (wrappers.length > 0)
			runWrapper(wrappers, 0, wrappers.length - 1, req, res)()
	})

	const notFoundHandler = (req: IncomingMessage, res: ServerResponse) => {
		res.writeHead(404)
		res.end("not found")
	}

	router.on(httpMethods, "*", notFoundHandler)

	return {
		start: () => {
			httpServer.listen(options.port || 3000, () => {})
		},
		router,
		layouts: {},
	}
}

export type Z22Server = ReturnType<typeof createZ22Server>
