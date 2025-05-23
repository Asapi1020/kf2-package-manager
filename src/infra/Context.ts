import type { Store as Domain } from "../domain/Store";
import type { Store as Driver } from "../driver/Store";

export interface Context {
	domain: Domain;
	driver: Driver;
}
