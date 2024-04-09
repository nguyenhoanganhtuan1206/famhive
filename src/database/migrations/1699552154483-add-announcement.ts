import { MigrationInterface, QueryRunner } from "typeorm";

export class addAnnouncement1699552154483 implements MigrationInterface {
  name = "addAnnouncement1699552154483";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "announcements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "start_date_time" TIMESTAMP NOT NULL, "end_date_time" TIMESTAMP NOT NULL, "to" character varying NOT NULL, "enabled" boolean NOT NULL DEFAULT false, "redirect_to_screen" character varying NOT NULL, CONSTRAINT "PK_b3ad760876ff2e19d58e05dc8b0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "announcement-by-locales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "banner_url" character varying NOT NULL, "text_button" character varying NOT NULL, "lang_code" character varying NOT NULL, "announcement_id" uuid NOT NULL, CONSTRAINT "PK_1ce4155f3c7b0ff09c1a7dccee4" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "announcement-by-locales" ADD CONSTRAINT "fk_announcement_by_local_announcement" FOREIGN KEY ("announcement_id") REFERENCES "announcements"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "announcement-by-locales" DROP CONSTRAINT "fk_announcement_by_local_announcement"`
    );
    await queryRunner.query(`DROP TABLE "announcement-by-locales"`);
    await queryRunner.query(`DROP TABLE "announcements"`);
  }
}
