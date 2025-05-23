import { isArray, isNumber, isString } from "@asp1020/type-utils";
import type { Context } from "./Context";

export class StartUsecase {
	private context: Context;

	constructor(context: Context) {
		this.context = context;
	}

	public start(): void {
		const cmd = this.setupLaunchCommand();
		this.context.driver.logger.info(`Launching game with command: ${cmd}`);
		try {
			this.context.infra.processRepository.executeCommand(cmd);
		} catch {
			this.context.driver.logger.info("Probably steam is asking you to confirm execution");
		}
	}

	private setupLaunchCommand(): string {
		const options = this.context.domain.config.launchOptions;
		const openMapCommands = [options.mapName];
		if (isString(options.gameMode)) {
			openMapCommands.push(`game=${options.gameMode}`);
		}
		if (isArray(options.mutators) && options.mutators.length > 0) {
			openMapCommands.push(`mutators=${options.mutators.join(",")}`);
		}
		if (isNumber(options.difficulty)) {
			openMapCommands.push(`difficulty=${options.difficulty}`);
		}
		if (isNumber(options.gameLength)) {
			openMapCommands.push(`gamelength=${options.gameLength}`);
		}
		if (isArray(options.otherOptions) && options.otherOptions.length > 0) {
			openMapCommands.push(...options.otherOptions);
		}
		const launchGameOptions = ["-useunpublished", `-languageforcooking=${options.languageForCooking}`, "-log"];
		return `${options.gamePath} ${openMapCommands.join("?")} ${launchGameOptions.join(" ")}`;
	}
}
