import { createServer } from "http"
import handler from "./entry-server"

const server = createServer(handler)

// @ts-ignore
server.listen($Z22$.env.PORT)
