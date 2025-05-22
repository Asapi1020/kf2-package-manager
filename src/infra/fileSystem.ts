import { type WriteFileOptions, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { isArray, isString } from "@asp1020/type-utils";
import type { Ini } from "../domain/Ini";

export function readIni(path: string): Ini {
	if (!existsSync(path)) {
		return {};
	}
	const content = readFileSync(path, "utf8");
	const lines = content.split(/\r?\n/);
	const ini: Ini = {};
	let currentSection = "";

	for (const line of lines) {
		const trimmed = line.trim();
		if (trimmed === "" || trimmed.startsWith(";") || trimmed.startsWith("#")) {
			continue;
		}
		const sectionMatch = trimmed.match(/^\[(.+?)\]$/);
		if (sectionMatch) {
			currentSection = sectionMatch[1];
			if (Object.prototype.hasOwnProperty.call(ini, currentSection)) {
				console.warn(`Duplicate section found: ${currentSection}. Overwriting previous values.`);
			}
			ini[currentSection] = {};
			continue;
		}
		const keyValueMatch = trimmed.match(/^([^=]+)=(.*)$/);
		if (keyValueMatch) {
			const key = keyValueMatch[1].trim();
			const value = keyValueMatch[2].trim();

			if (!Object.prototype.hasOwnProperty.call(ini[currentSection], key)) {
				ini[currentSection][key] = value;
			} else if (isArray<string>(ini[currentSection][key])) {
				(ini[currentSection][key] as string[]).push(value);
			} else if (isString(ini[currentSection][key])) {
				ini[currentSection][key] = [ini[currentSection][key] as string, value];
			}
		}
	}
	return ini;
}

export function writeIni(path: string, content: Ini): void {
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
	safeWriteFileSync(path, iniFile, "utf8");
}

export function safeWriteFileSync(
	path: string,
	data: string | NodeJS.ArrayBufferView,
	options?: WriteFileOptions,
): void {
	const dir = dirname(path);
	mkdirSync(dir, { recursive: true });
	writeFileSync(path, data, options);
}
