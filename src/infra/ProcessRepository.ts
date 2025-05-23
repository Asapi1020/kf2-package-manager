import type { Logger } from "../driver/Logger";
import type { Processor } from "../driver/Processor";
import type { Context } from "./Context";

export class ProcessRepository {
	private context: Context;

	constructor(cotext: Context) {
		this.context = cotext;
	}

	get logger(): Logger {
		return this.context.driver.logger;
	}

	get processor(): Processor {
		return this.context.driver.processor;
	}

	public runProcess(name: string, cmd: string, args: string[] = []): void {
		const process = this.processor.start(cmd, args);
		process.on("exit", (code) => {
			if (code === 0) {
				this.logger.info(`[${name}] Process completed successfully.`);
			} else {
				this.logger.error(`[${name}] Process exited with code ${code}.`);
			}
		});
	}
}
