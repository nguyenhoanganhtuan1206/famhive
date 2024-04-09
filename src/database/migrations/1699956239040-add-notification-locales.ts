import { MigrationInterface, QueryRunner } from "typeorm";

export class addNotificationLocales1699956239040 implements MigrationInterface {
    name = 'addNotificationLocales1699956239040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notification-by-locales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "content" character varying NOT NULL, "lang_code" character varying NOT NULL, "notification_id" uuid NOT NULL, CONSTRAINT "PK_99d47d185d8d28c731083440630" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "title"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "content"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "send_to_lang_codes"`);
        await queryRunner.query(`ALTER TABLE "notification-by-locales" ADD CONSTRAINT "fk_notification_by_local_notification" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notification-by-locales" DROP CONSTRAINT "fk_notification_by_local_notification"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "send_to_lang_codes" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "content" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "title" character varying NOT NULL`);
        await queryRunner.query(`DROP TABLE "notification-by-locales"`);
    }

}
