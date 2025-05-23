import {
	type WatchListener,
	type WriteFileOptions,
	existsSync,
	mkdirSync,
	readFileSync,
	watch,
	writeFileSync,
} from "node:fs";
import { dirname } from "node:path";

export class FileDriver {
	public read(filePath: string, encoding: BufferEncoding): string {
		if (!existsSync(filePath)) {
			return "";
		}
		return readFileSync(filePath, encoding);
	}

	public write(filePath: string, data: string | NodeJS.ArrayBufferView, options?: WriteFileOptions): void {
		const dir = dirname(filePath);
		mkdirSync(dir, { recursive: true });
		writeFileSync(filePath, data, options);
	}

	public watch(filePath: string, listener?: WatchListener<string>): void {
		watch(filePath, listener);
	}
}
