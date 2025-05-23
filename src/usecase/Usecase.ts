import type { Context } from "./Context";
import { StartUsecase } from "./StartUsecase";
import { CompileUsecase } from "./compile";

export class Usecase {
	public compileUsecase: CompileUsecase;
	public startUsecase: StartUsecase;

	constructor(context: Context) {
		this.compileUsecase = new CompileUsecase(context);
		this.startUsecase = new StartUsecase(context);
	}
}
