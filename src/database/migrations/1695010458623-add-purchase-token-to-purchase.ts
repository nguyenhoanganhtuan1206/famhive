import { MigrationInterface, QueryRunner } from "typeorm";

export class addPurchaseTokenToPurchase1695010458623 implements MigrationInterface {
    name = 'addPurchaseTokenToPurchase1695010458623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ADD "purchase_token" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "purchase_token"`);
    }

}
