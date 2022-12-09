import { z } from "zod"

export const ModeV = z.literal("development").or(z.literal("production"))

export const OptionsV = z.object({
	mode: ModeV,
	port: z.number().default(3000),
})
export type OptionsI = z.input<typeof OptionsV>
export type Options = z.output<typeof OptionsV>

export type Z22Program = {
	options: Options
}