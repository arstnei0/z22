import pino from "pino"
import PinoPretty from "pino-pretty"

export let logger: ReturnType<typeof pino> = (() => {
	console.error("The logger is not set!")
}) as any

export const setLogger = (_logger: ReturnType<typeof pino>) => {
	logger = _logger
}

export type LoggerConfig = Parameters<typeof PinoPretty>[0]

export const DEV_LOGGER_CONFIG: LoggerConfig = {
	ignore: "pid,hostname,time,level",
}

export const PROD_LOGGER_CONFIG: LoggerConfig = {}
