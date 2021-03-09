import fs from "fs";

fs.rmdirSync("coverage/",     { recursive: true });
fs.rmdirSync("jsdocs/",       { recursive: true });
fs.rmdirSync("node_modules/", { recursive: true });
fs.rmdirSync("types/",        { recursive: true });
