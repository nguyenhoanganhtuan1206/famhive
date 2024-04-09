import {
    MigrationInterface,
    QueryRunner
} from "typeorm";

export class addFamilyCompleteSetup1681456605398 implements MigrationInterface {
    name = 'addFamilyCompleteSetup1681456605398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "completed_setup"`);
        await queryRunner.query(`ALTER TABLE "families" ADD "completed_setup" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "completed_setup"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "completed_setup" boolean NOT NULL DEFAULT false`);
    }

}
