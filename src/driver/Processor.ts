import { type ChildProcess, execSync, spawn } from "node:child_process";

export class Processor {
	public start(cmd: string, args: string[] = []): ChildProcess {
		const child = spawn(cmd, args, { stdio: "inherit", windowsHide: true });
		return child;
	}

	public terminate(child: ChildProcess): void {
		child.kill("SIGTERM");
	}

	public run(cmd: string): Buffer {
		return execSync(cmd, { stdio: "inherit" });
	}
}
