import { MigrationInterface, QueryRunner } from "typeorm";

export class addPaymentPlatformToPurchases1692584915055 implements MigrationInterface {
    name = 'addPaymentPlatformToPurchases1692584915055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."purchases_payment_platform_enum" AS ENUM('apple-pay', 'google-pay')`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "payment_platform" "public"."purchases_payment_platform_enum" NOT NULL DEFAULT 'apple-pay'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "payment_platform"`);
        await queryRunner.query(`DROP TYPE "public"."purchases_payment_platform_enum"`);
    }

}
