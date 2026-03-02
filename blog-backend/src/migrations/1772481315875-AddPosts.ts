import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPosts1772481315875 implements MigrationInterface {
    name = 'AddPosts1772481315875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_translations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "post_id" uuid NOT NULL, "language" character varying(5) NOT NULL, "title" character varying(255) NOT NULL, "slug" character varying(255) NOT NULL, "excerpt" character varying(255) NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_e54e7e89ee895deed98002a1993" UNIQUE ("language", "slug"), CONSTRAINT "UQ_1875c0986bedf4f97258d521d99" UNIQUE ("post_id", "language"), CONSTRAINT "PK_977f23a9a89bf4a1a9e2e29c136" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_11f143c8b50a9ff60340edca47" ON "post_translations" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_34390d3aa850c97492f1acef33" ON "post_translations" ("slug") `);
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum" AS ENUM('draft', 'published')`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "status" "public"."posts_status_enum" NOT NULL DEFAULT 'draft', "published_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "authorId" character varying NOT NULL, "author_id" uuid, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c5a322ad12a7bf95460c958e80" ON "posts" ("authorId") `);
        await queryRunner.query(`ALTER TABLE "post_translations" ADD CONSTRAINT "FK_11f143c8b50a9ff60340edca475" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_312c63be865c81b922e39c2475e" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_312c63be865c81b922e39c2475e"`);
        await queryRunner.query(`ALTER TABLE "post_translations" DROP CONSTRAINT "FK_11f143c8b50a9ff60340edca475"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c5a322ad12a7bf95460c958e80"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_34390d3aa850c97492f1acef33"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11f143c8b50a9ff60340edca47"`);
        await queryRunner.query(`DROP TABLE "post_translations"`);
    }

}
