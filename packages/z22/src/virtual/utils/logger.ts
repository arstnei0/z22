import pino from "pino"
import PinoPretty from "pino-pretty"

type LoggerConfig = Parameters<typeof PinoPretty>[0]

const DEV_LOGGER_CONFIG: LoggerConfig = {
	ignore: "pid,hostname,time",
	minimumLevel: "debug",
}

const PROD_LOGGER_CONFIG: LoggerConfig = {}

export const logger = pino(
	// @ts-ignore
	PinoPretty($Z22$.env.DEV ? DEV_LOGGER_CONFIG : PROD_LOGGER_CONFIG)
)

export type Logger = typeof logger

export default logger
