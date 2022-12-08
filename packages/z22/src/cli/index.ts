import * as process from "node:process"
import sade from "sade"
import * as vite from "vite"
import { Mode, run } from "../core"

export default () => {
	const p = sade("z22")

	p.command("dev", "Start the dev server", {
		default: true,
	}).action(() => run(Mode.Development))

	p.command("build", "Build the application").action(() =>
		run(Mode.Production)
	)

	p.parse(process.argv)
}
