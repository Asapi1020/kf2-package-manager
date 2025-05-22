#!/usr/bin/env node
import { Command } from "commander";
import { Config } from "../domain/Config";
import { compile } from "../usecase/compile";

const config = new Config();
const program = new Command();

program.name("kfpm").description("Killing Floor 2 Mods Package Manager");

program
	.command("compile")
	.description("Compile mods")
	.action(() => {
		compile(config);
	});

program.parse(process.argv);
