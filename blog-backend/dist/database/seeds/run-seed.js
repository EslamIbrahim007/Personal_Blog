"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("../data-source");
const seed_rbac_1 = require("./seed-rbac");
async function run() {
    await data_source_1.AppDataSource.initialize();
    await (0, seed_rbac_1.seedRbac)(data_source_1.AppDataSource);
    await data_source_1.AppDataSource.destroy();
}
run();
//# sourceMappingURL=run-seed.js.map