import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTimezoneOffsetToDevice1683631314568 implements MigrationInterface {
    name = 'AddTimezoneOffsetToDevice1683631314568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" ADD "timezone_offset" integer NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP COLUMN "timezone_offset"`);
    }

}
