import { MigrationInterface, QueryRunner } from "typeorm";

export class addDiscountTable1699288516492 implements MigrationInterface {
    name = 'addDiscountTable1699288516492'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."discounts_subscription_plan_enum" AS ENUM('All', 'Monthly', 'Manual')`);
        await queryRunner.query(`
            CREATE TABLE "discounts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "name" character varying NOT NULL,
                "discount_percentage" integer NOT NULL,
                "subscription_plan" "public"."discounts_subscription_plan_enum" NOT NULL,
                "start_date_time" TIMESTAMP NOT NULL,
                "end_date_time" TIMESTAMP NOT NULL,
                CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "discounts"`);
        await queryRunner.query(`DROP TYPE "public"."discounts_subscription_plan_enum"`);
    }

}
