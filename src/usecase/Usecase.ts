import type { Context } from "./Context";
import { CompileUsecase } from "./compile";

export class Usecase {
	public compileUsecase: CompileUsecase;

	constructor(context: Context) {
		this.compileUsecase = new CompileUsecase(context);
	}
}
