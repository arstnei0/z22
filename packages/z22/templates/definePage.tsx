import { Component, JSX } from "solid-js"
import { renderToStream } from "solid-js/web"
import { HttpHandler } from "../src/core/server"

export const definePage = async (Page: Component): Promise<HttpHandler> => {
	const layout = await import('virtual:z22/layout/default')
	const Layout = layout.default as Component<{children: JSX.Element}>

	return async (req, res) => {
		renderToStream(() => {
			return <Layout>
				<Page></Page>
			</Layout>
		}).pipe(res)
	}
}
