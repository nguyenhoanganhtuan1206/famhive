import { MigrationInterface, QueryRunner } from "typeorm";

export class addColor1679942852496 implements MigrationInterface {
    name = 'addColor1679942852496'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "color" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "color"`);
    }

}
