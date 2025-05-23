import type { Config } from "../domain/Config";
import type { Logger } from "../driver/Logger";
import type { FileRepository } from "../infra/FileRepository";
import type { ProcessRepository } from "../infra/ProcessRepository";
import type { Context } from "./Context";

export class CompileUsecase {
	private context: Context;
	private logChangedCount = 0;

	constructor(context: Context) {
		this.context = context;
	}

	get config(): Config {
		return this.context.domain.config;
	}

	get logger(): Logger {
		return this.context.driver.logger;
	}

	get fileRepository(): FileRepository {
		return this.context.infra.fileRepository;
	}

	get processRepository(): ProcessRepository {
		return this.context.infra.processRepository;
	}

	public compile(): void {
		this.updateKFEditorIni(this.config);
		this.fileRepository.watchChange(this.config.kfEditor.logPath, this.onLogUpdate.bind(this));
		this.processRepository.runProcess("KFEditor", this.config.kfEditor.binPath, ["make"]);
		this.logger.info("Compiling...");
	}

	private updateKFEditorIni(config: Config): void {
		const kfEditorIni = this.fileRepository.readIni(config.kfEditor.configPath);
		kfEditorIni.ModPackages = {
			ModPackagesInPath: config.modPackages.path,
			ModOutputDir: config.modPackages.output,
			ModPackages: config.modPackages.packages,
		};
		this.fileRepository.writeIni(config.kfEditor.configPath, kfEditorIni);
		this.logger.info("KFEditor.ini updated", kfEditorIni.ModPackages);
	}

	private onLogUpdate(): void {
		if (this.logChangedCount === 0) {
			this.logger.info("Initialized log file");
			this.logChangedCount++;
			return;
		}
		const log = this.fileRepository.readText(this.config.kfEditor.logPath);
		this.parseLog(log);
		this.processRepository.terminateProcess("KFEditor");
		process.exit(0);
	}

	private parseLog(log: string): void {
		const lines = log.split(/\r?\n/);
		for (const line of lines) {
			const trimmed = line.trim().toLowerCase();
			if (trimmed.includes("success")) {
				this.logger.info(line);
			} else if (trimmed.includes("warning")) {
				if (trimmed.includes("error")) {
					this.logger.error(line);
				} else {
					this.logger.warn(line);
				}
			} else if (trimmed.includes("failure")) {
				this.logger.error(line);
			}
		}
	}
}
