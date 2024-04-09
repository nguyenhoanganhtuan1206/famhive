import {
    MigrationInterface,
    QueryRunner
} from "typeorm";

export class addVerifyCode1680716347479 implements MigrationInterface {
    name = 'addVerifyCode1680716347479'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "verify_code" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "verify_code_created_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "users" ADD "verified" boolean`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_code_created_at"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verify_code"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verified"`);
    }

}
