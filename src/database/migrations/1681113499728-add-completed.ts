import { MigrationInterface, QueryRunner } from "typeorm";

export class addCompleted1681113499728 implements MigrationInterface {
    name = 'addCompleted1681113499728'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "completed_setup" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "completed_setup"`);
    }

}
