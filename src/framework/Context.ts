import type { Store as Domain } from "../domain/Store";
import type { Store as Driver } from "../driver/Store";
import type { Infra } from "../infra/Infra";
import type { Usecase } from "../usecase/Usecase";

export interface Context {
	domain: Domain;
	driver: Driver;
	infra: Infra;
	usecase: Usecase;
}
