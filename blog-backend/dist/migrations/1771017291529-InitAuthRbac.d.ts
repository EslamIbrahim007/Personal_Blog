import { MigrationInterface, QueryRunner } from "typeorm";
export declare class InitAuthRbac1771017291529 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
