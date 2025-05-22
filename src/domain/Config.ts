import config from "config";

export class Config {
	get kfEditorPath(): string {
		return config.get("kfEditorPath");
	}

	get modPackages(): ModPackagesConfig {
		return config.get("modPackages");
	}
}

export interface ModPackagesConfig {
	path: string;
	output: string;
	packages: string[];
}
