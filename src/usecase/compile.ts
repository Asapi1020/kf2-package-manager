import type { Config } from "../domain/Config";
import { readIni, writeIni } from "../infra/fileSystem";

export function compile(config: Config): void {
	updateKFEditorIni(config);
}

function updateKFEditorIni(config: Config): void {
	const kfEditorIni = readIni(config.kfEditorPath);
	kfEditorIni.ModPackages = {
		ModPackagesInPath: config.modPackages.path,
		ModOutputDir: config.modPackages.output,
		ModPackages: config.modPackages.packages,
	};
	writeIni(config.kfEditorPath, kfEditorIni);
}
