import { MigrationInterface, QueryRunner } from "typeorm";

export class addUntilTimeAndByweekdayToEvent1687942204172 implements MigrationInterface {
    name = 'addUntilTimeAndByweekdayToEvent1687942204172'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "until_date_time" TIMESTAMP`);
        await queryRunner.query(`CREATE TYPE "public"."events_by_week_day_enum" AS ENUM('MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "by_week_day" "public"."events_by_week_day_enum" array`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "by_week_day"`);
        await queryRunner.query(`DROP TYPE "public"."events_by_week_day_enum"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "until_date_time"`);
    }

}
