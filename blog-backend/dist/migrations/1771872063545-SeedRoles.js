"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedRoles1771872063545 = void 0;
class SeedRoles1771872063545 {
    async up(queryRunner) {
        await queryRunner.query(`INSERT INTO "roles" ("name") VALUES ('Reader'), ('Admin') ON CONFLICT ("name") DO NOTHING`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "roles" WHERE "name" IN ('Reader', 'Admin')`);
    }
}
exports.SeedRoles1771872063545 = SeedRoles1771872063545;
//# sourceMappingURL=1771872063545-SeedRoles.js.map