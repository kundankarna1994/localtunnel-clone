#!/usr/bin/env node
import yargs from "yargs";
import CreateServer from "./lib/CreateServer.js";

import log from "book";
import Debug from "debug";

const debug = Debug("localtunnel");

var argv = yargs(process.argv.slice(2))
    .usage("Usage : $0 --port [num]")
    .options("secure", {
        default: false,
        describe: "use this flag to indicate proxy over https",
        alias: "s",
    })
    .options("address", {
        default: "0.0.0.0",
        describe: "Ip address to bind",
        alias: "a",
    })
    .options("domain", {
        describe:
            "Specify the base domain name. This is optional if hosting localtunnel from a regular example",
    })
    .options("maxsockets", {
        default: 10,
        describe:
            "Maximum number of tcp sockets each client is allowed to establish at one time (the tunnels)",
        alias: "m",
    })
    .command("start", "Start the localtunnel server")
    .example("$0 start -p 8000", "Start the local tunnel server")
    .alias("p", "port")
    .nargs("p", 1)
    .describe("p", "Local port of your server")
    .demandOption(["p"])
    .help("h")
    .alias("h", "help")
    .epilog("Copyright @2023").argv;

if (argv.help) {
    yargs.showHelp();
    process.exit();
}

const server = CreateServer({
    max_tcp_sockets: argv.maxsockets,
    secure: argv.secure,
    domain: argv.domain,
});

server.listen(argv.port, argv.address, () => {
    debug("Server listening on port : %d", server.address().port);
});

process.on("SIGINT", () => {
    process.exit();
});

process.on("SIGTERM", () => {
    process.exit();
});

process.on("uncaughtException", (err) => {
    log.console.error(err);
});

process.on("unhandledRejection", (reason, promise) => {
    log.error(reason);
});
