import { isArray, isString } from "@asp1020/type-utils";
import type { Ini } from "../domain/Ini";
import type { Context } from "./Context";

export class FileRepository {
	private context: Context;
	constructor(context: Context) {
		this.context = context;
	}

	get driver(): Context["driver"] {
		return this.context.driver;
	}

	public readText(path: string): string {
		const content = this.driver.fileDriver.read(path, "utf8");
		return content;
	}

	public readIni(path: string): Ini {
		const content = this.driver.fileDriver.read(path, "utf8");
		const lines = content.split(/\r?\n/);
		const ini: Ini = {};
		let currentSection = "";

		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed === "" || trimmed.startsWith(";") || trimmed.startsWith("#")) {
				continue;
			}
			const section = this.isSectionLine(trimmed);
			if (section) {
				currentSection = section;
				if (Object.prototype.hasOwnProperty.call(ini, currentSection)) {
					console.warn(`Duplicate section found: ${currentSection}. Overwriting previous values.`);
				}
				ini[currentSection] = {};
				continue;
			}
			const keyValue = this.isKeyValueLine(trimmed);
			if (keyValue && currentSection) {
				this.handleKeyValue(ini, currentSection, keyValue[0], keyValue[1]);
			}
		}
		return ini;
	}

	public writeIni(path: string, content: Ini): void {
		const sections = Object.entries(content).map(([section, values]) => {
			const sectionLine = `[${section}]`;
			const valuesLines = Object.entries(values).map(([key, value]) => {
				if (isArray(value)) {
					return value.map((v) => `${key}=${v}`).join("\n");
				}
				return `${key}=${value}`;
			});
			return [sectionLine, ...valuesLines].join("\n");
		});
		const iniFile = sections.join("\n\n");
		this.driver.fileDriver.write(path, iniFile, "utf8");
	}

	public watchChange(path: string, onChange: () => void): void {
		this.driver.fileDriver.watch(path, (eventType, filename) => {
			if (eventType === "change" && filename) {
				this.driver.logger.info(`File changed: ${filename}`);
				onChange();
			}
		});
	}

	private isSectionLine(line: string): string | null {
		const match = line.match(/^\[(.+?)\]$/);
		return match ? match[1] : null;
	}

	private isKeyValueLine(line: string): [string, string] | null {
		const match = line.match(/^([^=]+)=(.*)$/);
		return match ? [match[1].trim(), match[2].trim()] : null;
	}

	private handleKeyValue(ini: Ini, section: string, key: string, value: string): void {
		if (!Object.prototype.hasOwnProperty.call(ini[section], key)) {
			ini[section][key] = value;
		} else if (isArray<string>(ini[section][key])) {
			(ini[section][key] as string[]).push(value);
		} else if (isString(ini[section][key])) {
			ini[section][key] = [ini[section][key] as string, value];
		}
	}
}
