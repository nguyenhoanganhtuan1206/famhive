import { MigrationInterface, QueryRunner } from "typeorm";

export class addRruleOnTodosTable1708586107477 implements MigrationInterface {
    name = 'addRruleOnTodosTable1708586107477'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ADD "is_recurring" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."todos_recurring_type_enum" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "recurring_type" "public"."todos_recurring_type_enum"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "until_date_time" TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "public"."todos_by_week_day_enum" AS ENUM('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU')`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "by_week_day" "public"."todos_by_week_day_enum" array`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "rrule" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "rrule"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "by_week_day"`);
        await queryRunner.query(`DROP TYPE "public"."todos_by_week_day_enum"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "until_date_time"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "recurring_type"`);
        await queryRunner.query(`DROP TYPE "public"."todos_recurring_type_enum"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "is_recurring"`);
    }

}
