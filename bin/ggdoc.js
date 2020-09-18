#!/usr/bin/env node
const program = require("commander");
const select = program.parse(process.argv).args[0];

const create = require("../src/create");
const output = require("../src/output");

if (select) {
  create(select, output);
}
