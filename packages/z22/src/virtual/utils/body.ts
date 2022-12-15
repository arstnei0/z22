import { IncomingMessage } from "http"

export async function getBody(req: IncomingMessage) {
	return new Promise<any>((resolve) => {
		let body = ""

		req.on("data", (data) => (body += data))
		req.on("end", () => {
			resolve(body)
		})
	})
}
