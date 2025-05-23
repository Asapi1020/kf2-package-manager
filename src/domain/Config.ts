import config from "config";

export class Config {
	get kfEditor(): KFEditorConfig {
		return config.get("kfEditor");
	}

	get modPackages(): ModPackagesConfig {
		return config.get("modPackages");
	}

	get launchOptions(): LaunchConfig {
		return config.get("launchOptions");
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

export interface LaunchConfig {
	gamePath: string;
	languageForCooking: string;
	mapName: string;
	gameMode: string;
	mutators: string[];
	difficulty: number;
	gameLength: number;
	otherOptions: string[];
}
