import { MigrationInterface, QueryRunner } from "typeorm";

export class addBod1684343335919 implements MigrationInterface {
    name = 'addBod1684343335919'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "birthday" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthday"`);
    }

}
