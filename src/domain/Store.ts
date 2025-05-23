import { Config } from "./Config";

export class Store {
	public config: Config;

	constructor() {
		this.config = new Config();
	}
}
