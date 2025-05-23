#!/usr/bin/env node
import { Store as Domain } from "../domain/Store";
import { Store as Driver } from "../driver/Store";
import { Program } from "../framework/Program";
import { Infra } from "../infra/Infra";
import { Usecase } from "../usecase/Usecase";

const domain = new Domain();
const driver = new Driver();
const infra = new Infra({ domain, driver });
const usecase = new Usecase({ domain, driver, infra });
const program = new Program({ domain, driver, infra, usecase });
program.parse(process.argv);
