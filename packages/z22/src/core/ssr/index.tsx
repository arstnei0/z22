import { Component, JSX } from "solid-js"
import { renderToStream } from "solid-js/web"
import { HttpHandler } from "../server"
import { layoutManager, viteServer } from ".."
import { workingPagePath } from "../routes"

export type PageMeta = {
	layout?: string
}

const defaultPageMeta: PageMeta = {
	layout: "default",
}

export type Page = Component

export const definePage = (async (
	pageMetaOrPage: any,
	pageOrUndefined: any
): Promise<HttpHandler> => {
	let pageMeta = defaultPageMeta
	let Page: Page
	if (typeof pageMetaOrPage === "object") {
		pageMeta = {
			...pageMeta,
			...(pageMetaOrPage as PageMeta),
		}

		Page = pageOrUndefined
	} else {
		Page = pageMetaOrPage
	}

	const layout = layoutManager.layouts[pageMeta.layout as string]

	if (layout) {
		const Layout = layout.comp
		if (workingPagePath) {
			layoutManager.layouts[pageMeta.layout as string].pages.set(workingPagePath, true)
		}

		return async (req, res) => {
			renderToStream(() => {
				return (
					<Layout>
						<Page></Page>
					</Layout>
				)
			}).pipe(res)
		}
	} else {
		return async (req, res) => {
			renderToStream(() => {
				return <Page></Page>
			}).pipe(res)
		}
	}
}) as
	| ((pageMeta: PageMeta, Page: Page) => Promise<HttpHandler>)
	| ((Page: Page) => Promise<HttpHandler>)
