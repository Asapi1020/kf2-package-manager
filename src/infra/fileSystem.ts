import { execSync } from "node:child_process";
import { type WriteFileOptions, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { isArray, isString } from "@asp1020/type-utils";
import type { Ini } from "../domain/Ini";

function isSectionLine(line: string): string | null {
	const match = line.match(/^\[(.+?)\]$/);
	return match ? match[1] : null;
}

function isKeyValueLine(line: string): [string, string] | null {
	const match = line.match(/^([^=]+)=(.*)$/);
	return match ? [match[1].trim(), match[2].trim()] : null;
}

function handleKeyValue(ini: Ini, section: string, key: string, value: string): void {
	if (!Object.prototype.hasOwnProperty.call(ini[section], key)) {
		ini[section][key] = value;
	} else if (isArray<string>(ini[section][key])) {
		(ini[section][key] as string[]).push(value);
	} else if (isString(ini[section][key])) {
		ini[section][key] = [ini[section][key] as string, value];
	}
}

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
		const section = isSectionLine(trimmed);
		if (section) {
			currentSection = section;
			if (Object.prototype.hasOwnProperty.call(ini, currentSection)) {
				console.warn(`Duplicate section found: ${currentSection}. Overwriting previous values.`);
			}
			ini[currentSection] = {};
			continue;
		}
		const keyValue = isKeyValueLine(trimmed);
		if (keyValue && currentSection) {
			handleKeyValue(ini, currentSection, keyValue[0], keyValue[1]);
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

export function run(cmd: string): Buffer {
	return execSync(cmd, { stdio: "inherit" });
}
