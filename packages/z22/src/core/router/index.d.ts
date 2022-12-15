/// <reference types="node" resolution-mode="require"/>
import { IncomingMessage, ServerResponse } from "http"
import { z } from "zod"
export type Route = {
	id: string
	path: string
	api: Partial<Record<ApiMethod, string>>
}
declare const ApiMethodV: z.ZodEnum<["GET", "POST", "PUT", "DELETE", "PATCH"]>
export type ApiMethod = z.infer<typeof ApiMethodV>
export declare const Handler: any
export type Handler = typeof Handler.Item
export type FetchHandler = Parameters<typeof Handler["fetch"]>[0]
export type StreamHandler = Parameters<typeof Handler["stream"]>[0]
export type Context = {
	req: IncomingMessage
	res: ServerResponse
}
export declare class Router {
	routes: Map<string, Route>
	constructor()
	stringifyRoutes(outputName: string): string
}
export {}
