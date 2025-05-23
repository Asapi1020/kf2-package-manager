import { type WriteFileOptions, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export class FileDriver {
	public readFile(filePath: string, encoding: BufferEncoding): string {
		return readFileSync(filePath, encoding);
	}

	public writeFile(filePath: string, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): void {
		const dir = dirname(filePath);
		mkdirSync(dir, { recursive: true });
		writeFileSync(filePath, data, options);
	}
}
