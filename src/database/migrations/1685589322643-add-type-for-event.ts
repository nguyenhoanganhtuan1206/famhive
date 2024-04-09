import { MigrationInterface, QueryRunner } from "typeorm";

export class addTypeForEvent1685589322643 implements MigrationInterface {
    name = 'addTypeForEvent1685589322643'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."events_event_type_enum" AS ENUM('manual', 'birthday', 'official')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "event_type" "public"."events_event_type_enum" NOT NULL DEFAULT 'manual'`);
        await queryRunner.query(`UPDATE "events" SET "event_type" = 'official' WHERE "is_auto_generated" = true`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "is_auto_generated"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "is_auto_generated" boolean DEFAULT false`);
        await queryRunner.query(`UPDATE "events" SET "is_auto_generated" = true WHERE "event_type" = 'official'`);
        await queryRunner.query(`ALTER TABLE "events" DROP "event_type"`);
        await queryRunner.query(`DROP TYPE "public"."events_event_type_enum"`);
    }

}
