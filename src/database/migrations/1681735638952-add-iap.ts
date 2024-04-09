import {
    MigrationInterface,
    QueryRunner
} from "typeorm";

export class addIap1681735638952 implements MigrationInterface {
    name = 'addIap1681735638952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" character varying, "original_transaction_id" character varying, "product_id" character varying, "auto_renew_product_id" character varying, "auto_renew_status" boolean, "purchase_date" TIMESTAMP, "expires_date" TIMESTAMP, "family_id" uuid, CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "families" ADD "transaction_id" character varying`);
        await queryRunner.query(`ALTER TABLE "families" ADD "original_transaction_id" character varying`);
        await queryRunner.query(`ALTER TABLE "families" ADD "product_id" character varying`);
        await queryRunner.query(`ALTER TABLE "families" ADD "auto_renew_product_id" character varying`);
        await queryRunner.query(`ALTER TABLE "families" ADD "auto_renew_status" boolean`);
        await queryRunner.query(`ALTER TABLE "families" ADD "purchase_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "families" ADD "expires_date" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD CONSTRAINT "purchase_family_fk" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP CONSTRAINT "purchase_family_fk"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "expires_date"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "purchase_date"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "auto_renew_status"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "auto_renew_product_id"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "product_id"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "original_transaction_id"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "transaction_id"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
    }

}
