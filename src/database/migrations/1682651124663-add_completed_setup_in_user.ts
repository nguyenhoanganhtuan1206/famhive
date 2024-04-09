import {
    MigrationInterface,
    QueryRunner
} from "typeorm";

export class addCompletedSetupInUser1682651124663 implements MigrationInterface {
    name = 'addCompletedSetupInUser1682651124663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "completed_setup" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`UPDATE "users" SET "completed_setup" = LENGTH(COALESCE("full_name", '')) > 0 AND LENGTH(COALESCE("color", '')) > 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "completed_setup"`);
    }

}
