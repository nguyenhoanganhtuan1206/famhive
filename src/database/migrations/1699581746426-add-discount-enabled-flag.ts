import { MigrationInterface, QueryRunner } from "typeorm";

export class addDiscountEnabledFlag1699581746426 implements MigrationInterface {
    name = 'addDiscountEnabledFlag1699581746426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" ADD "enabled" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts" DROP COLUMN "enabled"`);
    }

}
