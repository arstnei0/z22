import type { Component } from "solid-js"
import type { FetchHandler } from "../core/router/index.js"
import { Handler } from "../core/router/index.js"

export const definePage = (Comp: Component) => {}
export const defineEndpoint = (handler: Handler | FetchHandler) => {
	if (typeof handler === "function") return Handler.fetch(handler)
	return handler
}

export { Handler } from "../core/router/index.js"
