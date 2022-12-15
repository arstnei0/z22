import { createServer } from "http"
import { httpHandler } from "./entry-server.jsx"

const server = createServer(httpHandler)

// @ts-ignore
server.listen($Z22$.env.PORT)
