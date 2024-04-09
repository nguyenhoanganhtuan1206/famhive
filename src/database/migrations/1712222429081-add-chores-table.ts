import { MigrationInterface, QueryRunner } from "typeorm";

export class addChoresTable1712222429081 implements MigrationInterface {
    name = 'addChoresTable1712222429081'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chore_done" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "chore_id" uuid NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_ced1246240df2fa6eaedd89adf7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chore_price_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chore_id" uuid NOT NULL, "date" TIMESTAMP NOT NULL, "reward_star" integer DEFAULT '0', "reward_money" numeric DEFAULT '0', CONSTRAINT "PK_88b44c27d24d282761265b1f518" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."chores_recurring_type_enum" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')`);
        await queryRunner.query(`CREATE TYPE "public"."chores_by_week_day_enum" AS ENUM('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU')`);
        await queryRunner.query(`CREATE TABLE "chores" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "icon" character varying NOT NULL, "title" character varying NOT NULL, "family_id" uuid NOT NULL, "due_date" TIMESTAMP, "reward_star" integer DEFAULT '0', "reward_money" numeric DEFAULT '0', "is_recurring" boolean NOT NULL DEFAULT false, "recurring_type" "public"."chores_recurring_type_enum", "until_date_time" TIMESTAMP, "by_week_day" "public"."chores_by_week_day_enum" array, "rrule" character varying, CONSTRAINT "PK_943e6520135dee468bed5a16181" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "balance_histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "amount_star" integer DEFAULT '0', "amount_money" numeric DEFAULT '0', "date" TIMESTAMP NOT NULL, "user_id" uuid NOT NULL, "create_by_id" character varying, "chore_id" uuid, "created_by_id" uuid, CONSTRAINT "PK_602ce2399f1a8fe7c42231b6d7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chores_assignees_users" ("chores_id" uuid NOT NULL, "users_id" uuid NOT NULL, CONSTRAINT "PK_2040b6881553eb77356fd046cd8" PRIMARY KEY ("chores_id", "users_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_22ae21499913ff33328c0fccc9" ON "chores_assignees_users" ("chores_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_08b114c7f840c784130e29389f" ON "chores_assignees_users" ("users_id") `);
        await queryRunner.query(`ALTER TABLE "families" ADD "reward_type" character varying NOT NULL DEFAULT 'star'`);
        await queryRunner.query(`ALTER TABLE "chore_done" ADD CONSTRAINT "fk_chore_done_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chore_done" ADD CONSTRAINT "fk_chore_done_chore" FOREIGN KEY ("chore_id") REFERENCES "chores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chore_price_histories" ADD CONSTRAINT "fk_price_histories_chore" FOREIGN KEY ("chore_id") REFERENCES "chores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chores" ADD CONSTRAINT "fk_chore_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD CONSTRAINT "fk_reward_histories_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD CONSTRAINT "fk_create_by_reward_histories_user" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD CONSTRAINT "fk_reward_histories_chore" FOREIGN KEY ("chore_id") REFERENCES "chores"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "chores_assignees_users" ADD CONSTRAINT "FK_22ae21499913ff33328c0fccc9b" FOREIGN KEY ("chores_id") REFERENCES "chores"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "chores_assignees_users" ADD CONSTRAINT "FK_08b114c7f840c784130e29389fa" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chores_assignees_users" DROP CONSTRAINT "FK_08b114c7f840c784130e29389fa"`);
        await queryRunner.query(`ALTER TABLE "chores_assignees_users" DROP CONSTRAINT "FK_22ae21499913ff33328c0fccc9b"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP CONSTRAINT "fk_reward_histories_chore"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP CONSTRAINT "fk_create_by_reward_histories_user"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP CONSTRAINT "fk_reward_histories_user"`);
        await queryRunner.query(`ALTER TABLE "chores" DROP CONSTRAINT "fk_chore_family"`);
        await queryRunner.query(`ALTER TABLE "chore_price_histories" DROP CONSTRAINT "fk_price_histories_chore"`);
        await queryRunner.query(`ALTER TABLE "chore_done" DROP CONSTRAINT "fk_chore_done_chore"`);
        await queryRunner.query(`ALTER TABLE "chore_done" DROP CONSTRAINT "fk_chore_done_user"`);
        await queryRunner.query(`ALTER TABLE "families" DROP COLUMN "reward_type"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_08b114c7f840c784130e29389f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_22ae21499913ff33328c0fccc9"`);
        await queryRunner.query(`DROP TABLE "chores_assignees_users"`);
        await queryRunner.query(`DROP TABLE "balance_histories"`);
        await queryRunner.query(`DROP TABLE "chores"`);
        await queryRunner.query(`DROP TYPE "public"."chores_by_week_day_enum"`);
        await queryRunner.query(`DROP TYPE "public"."chores_recurring_type_enum"`);
        await queryRunner.query(`DROP TABLE "chore_price_histories"`);
        await queryRunner.query(`DROP TABLE "chore_done"`);
    }

}
