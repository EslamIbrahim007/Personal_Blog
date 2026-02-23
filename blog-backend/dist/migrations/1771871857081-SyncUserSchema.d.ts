import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SyncUserSchema1771871857081 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
