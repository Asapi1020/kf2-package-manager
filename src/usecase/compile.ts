import type { Config } from "../domain/Config";
import { readIni, run, writeIni } from "../infra/fileSystem";

export function compile(config: Config): void {
	updateKFEditorIni(config);
	run(`${config.kfEditor.binPath} make`);
}

function updateKFEditorIni(config: Config): void {
	const kfEditorIni = readIni(config.kfEditor.configPath);
	kfEditorIni.ModPackages = {
		ModPackagesInPath: config.modPackages.path,
		ModOutputDir: config.modPackages.output,
		ModPackages: config.modPackages.packages,
	};
	writeIni(config.kfEditor.configPath, kfEditorIni);
}
