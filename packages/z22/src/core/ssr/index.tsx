import { Component } from "solid-js"
import { renderToStream } from "solid-js/web"
import { HttpHandler } from "../server"

export const definePage = (Page: Component): HttpHandler => {
	return (req, res) => {
		renderToStream(() => <Page></Page>).pipe(res)
	}
}
