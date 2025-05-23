import type { Context } from "./Context";
import { FileRepository } from "./FileRepository";
import { ProcessRepository } from "./ProcessRepository";

export class Infra {
	public fileRepository: FileRepository;
	public processRepository: ProcessRepository;

	constructor(context: Context) {
		this.fileRepository = new FileRepository(context);
		this.processRepository = new ProcessRepository(context);
	}
}
