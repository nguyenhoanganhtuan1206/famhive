import { MigrationInterface, QueryRunner } from "typeorm";

export class addRemoveFirstLastName1681805447975 implements MigrationInterface {
    name = 'addRemoveFirstLastName1681805447975'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying`);
    }

}
