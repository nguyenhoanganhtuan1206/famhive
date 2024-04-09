import type { MigrationInterface, QueryRunner } from 'typeorm';

export class addTodo1679595748567 implements MigrationInterface {
  name = 'addTodo1679595748567';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type" character varying NOT NULL, "text" character varying NOT NULL, "is_done" boolean NOT NULL DEFAULT false, "owner_id" uuid NOT NULL, "assignee_id" uuid, "due_date" TIMESTAMP, CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_translations" DROP COLUMN "language_code"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."post_translations_language_code_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "FK_31317705e16ae72e98f9a66cee4" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "FK_6d7c3fd77573b5ecd5e1e83704d" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todos" DROP CONSTRAINT "FK_6d7c3fd77573b5ecd5e1e83704d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "todos" DROP CONSTRAINT "FK_31317705e16ae72e98f9a66cee4"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."post_translations_language_code_enum" AS ENUM('en_US', 'ru_RU')`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_translations" ADD "language_code" "public"."post_translations_language_code_enum" NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "todos"`);
  }
}
