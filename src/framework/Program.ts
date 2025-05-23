import { Command } from "commander";
import type { Context } from "./Context";

export class Program {
	private program: Command;
	constructor(context: Context) {
		this.program = new Command();
		this.program.name("kfpm").description("Killing Floor 2 Mods Package Manager");
		this.program
			.command("compile")
			.description("Compile mods")
			.action(() => {
				context.usecase.compileUsecase.compile();
			});
	}
	public parse(argv: string[]): void {
		this.program.parse(argv);
	}
}
