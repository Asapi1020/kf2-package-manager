import type { Config } from "../domain/Config";
import type { FileRepository } from "../infra/FileRepository";
import type { ProcessRepository } from "../infra/ProcessRepository";
import type { Context } from "./Context";

export class CompileUsecase {
	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	get config(): Config {
		return this.context.domain.config;
	}

	get fileRepository(): FileRepository {
		return this.context.infra.fileRepository;
	}

	get processRepository(): ProcessRepository {
		return this.context.infra.processRepository;
	}

	public compile(): void {
		this.updateKFEditorIni(this.config);
		this.processRepository.runProcess("KFEditor", this.config.kfEditor.binPath, ["make"]);
	}

	private updateKFEditorIni(config: Config): void {
		const kfEditorIni = this.fileRepository.readIni(config.kfEditor.configPath);
		kfEditorIni.ModPackages = {
			ModPackagesInPath: config.modPackages.path,
			ModOutputDir: config.modPackages.output,
			ModPackages: config.modPackages.packages,
		};
		this.fileRepository.writeIni(config.kfEditor.configPath, kfEditorIni);
		this.context.driver.logger.info("KFEditor.ini updated", kfEditorIni.ModPackages);
	}
}
