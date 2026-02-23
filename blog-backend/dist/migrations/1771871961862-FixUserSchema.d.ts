import { MigrationInterface, QueryRunner } from "typeorm";
export declare class FixUserSchema1771871961862 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
