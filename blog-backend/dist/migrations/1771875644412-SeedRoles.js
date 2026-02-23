"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRoles1771875644412 = void 0;
class SeedRoles1771875644412 {
    async up(queryRunner) {
        await queryRunner.query(`INSERT INTO "roles" ("name") VALUES ('Reader'), ('Admin') ON CONFLICT ("name") DO NOTHING`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "roles" WHERE "name" IN ('Reader', 'Admin')`);
    }
}
exports.SeedRoles1771875644412 = SeedRoles1771875644412;
//# sourceMappingURL=1771875644412-SeedRoles.js.map