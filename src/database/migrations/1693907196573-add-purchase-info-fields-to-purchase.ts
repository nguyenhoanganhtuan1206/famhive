import { MigrationInterface, QueryRunner } from "typeorm";

export class addPurchaseInfoFieldsToPurchase1693907196573 implements MigrationInterface {
    name = 'addPurchaseInfoFieldsToPurchase1693907196573'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ADD "price_currency_code" character varying`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "price_amount_micros" character varying`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "country_code" character varying`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "payment_state" integer`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "purchase_type" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "purchase_type"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "payment_state"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "country_code"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "price_amount_micros"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "price_currency_code"`);
    }

}
