import { MigrationInterface, QueryRunner } from "typeorm";

export class updateDiscountEnum1700128963768 implements MigrationInterface {
    name = 'updateDiscountEnum1700128963768'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."discounts_subscription_plan_enum" RENAME TO "discounts_subscription_plan_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."discounts_subscription_plan_enum" AS ENUM('All', 'Monthly', 'Annually')`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "subscription_plan" TYPE "public"."discounts_subscription_plan_enum" USING "subscription_plan"::"text"::"public"."discounts_subscription_plan_enum"`);
        await queryRunner.query(`DROP TYPE "public"."discounts_subscription_plan_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."discounts_subscription_plan_enum_old" AS ENUM('All', 'Monthly', 'Manual')`);
        await queryRunner.query(`ALTER TABLE "discounts" ALTER COLUMN "subscription_plan" TYPE "public"."discounts_subscription_plan_enum_old" USING "subscription_plan"::"text"::"public"."discounts_subscription_plan_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."discounts_subscription_plan_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."discounts_subscription_plan_enum_old" RENAME TO "discounts_subscription_plan_enum"`);
    }

}
