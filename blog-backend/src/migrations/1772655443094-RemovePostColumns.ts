import { MigrationInterface, QueryRunner } from "typeorm";

export class RemovePostColumns1772655443094 implements MigrationInterface {
    name = 'RemovePostColumns1772655443094'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "title"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "title" character varying NOT NULL`);
    }

}
