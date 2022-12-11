import { z } from "zod"

export const ModeV = z.literal("development").or(z.literal("production"))

export const OptionsV = z.object({
	mode: ModeV,
	port: z.number().default(3000),
	host: z.string().default("0.0.0.0"),
})
export type OptionsI = z.input<typeof OptionsV>
export type Options = z.output<typeof OptionsV>
