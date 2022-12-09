import { IncomingMessage, ServerResponse } from "http"
import { routes } from "./router"
import fmw, { HTTPMethod } from 'find-my-way'
import { ApiMethod, Handler } from "../core/router"

const router = fmw()

Object.entries(routes).forEach(([id, route]) => {
    (Object.entries(route) as [ApiMethod, Handler][]).forEach(async ([method, handle]) => {
        router.on(method as HTTPMethod, id, (req, res) => {
            handle(req, res)
        })
    })
})

const handler = (req: IncomingMessage, res: ServerResponse) => {
    router.lookup(req, res)
}

export default handler