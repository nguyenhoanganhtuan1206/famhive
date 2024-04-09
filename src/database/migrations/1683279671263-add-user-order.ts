import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserOrder1683279671263 implements MigrationInterface {
    name = 'addUserOrder1683279671263'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "order" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "order"`);
    }

}
