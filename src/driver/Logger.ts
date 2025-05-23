import winston from "winston";

export class Logger {
	public logger: winston.Logger;

	constructor() {
		this.logger = winston.createLogger({
			level: "info",
			format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
			transports: [new winston.transports.Console()],
		});
	}

	public info(message: string, ...meta: unknown[]): void {
		this.logger.info(message, ...meta);
	}

	public warn(message: string, ...meta: unknown[]): void {
		this.logger.warn(message, ...meta);
	}

	public error(message: string, ...meta: unknown[]): void {
		this.logger.error(message, ...meta);
	}
}
