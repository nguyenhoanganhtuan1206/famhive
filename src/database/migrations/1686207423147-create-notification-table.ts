import { MigrationInterface, QueryRunner } from 'typeorm';

export class createNotificationTable1686207423147 implements MigrationInterface {
  name = 'createNotificationTable1686207423147';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."notifications_to_enum" AS ENUM('ALL_USER', 'NORMAL_USER', 'PREMIUM_USER')`);
    await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('PENDING', 'DONE', 'CANCELLED')`);
    await queryRunner.query(`
        CREATE TABLE "notifications" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          "title" character varying NOT NULL,
          "content" character varying NOT NULL,
          "to" "public"."notifications_to_enum" NOT NULL DEFAULT 'ALL_USER',
          "scheduled_date_time" TIMESTAMP NOT NULL,
          "status" "public"."notifications_status_enum" NOT NULL DEFAULT 'PENDING',
          CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."notifications_to_enum"`);
  }
}
