import { FileDriver } from "./FileDriver";
import { Logger } from "./Logger";
import { Processor } from "./Processor";

export class Store {
	public logger: Logger;
	public fileDriver: FileDriver;
	public processor: Processor;

	constructor() {
		this.logger = new Logger();
		this.fileDriver = new FileDriver();
		this.processor = new Processor();
	}
}
