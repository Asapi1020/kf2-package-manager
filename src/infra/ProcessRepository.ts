import type { ChildProcess } from "node:child_process";
import type { Logger } from "../driver/Logger";
import type { Processor } from "../driver/Processor";
import type { Context } from "./Context";

export class ProcessRepository {
	private context: Context;
	private processes: Map<string, ChildProcess> = new Map();

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
		if (this.processes.has(name)) {
			this.logger.error(`[${name}] Process is already running.`);
			return;
		}
		const process = this.processor.start(cmd, args);
		process.on("exit", (code) => {
			if (code === 0) {
				this.logger.info(`[${name}] Process completed successfully.`);
			} else {
				this.logger.error(`[${name}] Process exited with code ${code}.`);
			}
		});
		this.processes.set(name, process);
	}

	public terminateProcess(name: string): void {
		const process = this.processes.get(name);
		if (!process) {
			this.logger.error(`[${name}] No such process to terminate.`);
			return;
		}
		this.processor.terminate(process);
		this.logger.info(`[${name}] Process terminated.`);
	}

	public executeCommand(cmd: string): Buffer {
		return this.processor.run(cmd);
	}
}
