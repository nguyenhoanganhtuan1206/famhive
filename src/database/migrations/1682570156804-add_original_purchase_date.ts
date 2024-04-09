import { MigrationInterface, QueryRunner } from "typeorm";

export class addOriginalPurchaseDate1682570156804 implements MigrationInterface {
    name = 'addOriginalPurchaseDate1682570156804'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" ADD "original_purchase_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "families" ADD "original_purchase_date" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "original_purchase_date"`);
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "original_purchase_date"`);
    }

}
