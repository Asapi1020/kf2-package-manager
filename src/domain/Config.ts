import config from "config";

export class Config {
	get kfEditor(): KFEditorConfig {
		return config.get("kfEditor");
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

export interface KFEditorConfig {
	configPath: string;
	binPath: string;
	logPath: string;
}
