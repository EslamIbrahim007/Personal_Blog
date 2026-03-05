import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostTranslationExcerpt1772682433968 implements MigrationInterface {
    name = 'UpdatePostTranslationExcerpt1772682433968'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_translations" DROP CONSTRAINT "UQ_e54e7e89ee895deed98002a1993"`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "slug" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "excerpt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ADD CONSTRAINT "UQ_e54e7e89ee895deed98002a1993" UNIQUE ("language", "slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_translations" DROP CONSTRAINT "UQ_e54e7e89ee895deed98002a1993"`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "excerpt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post_translations" ADD CONSTRAINT "UQ_e54e7e89ee895deed98002a1993" UNIQUE ("language", "slug")`);
    }

}
