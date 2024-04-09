/* eslint-disable max-len */
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFamilyToEvent1680522266109 implements MigrationInterface {
  name = 'addFamilyToEvent1680522266109';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b"`,
    );
    await queryRunner.query(`ALTER TABLE "events" ADD "assignee_id" uuid`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD "family_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."recurring_type_enum" RENAME TO "recurring_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."events_recurring_type_enum" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ALTER COLUMN "recurring_type" TYPE "public"."events_recurring_type_enum" USING "recurring_type"::"text"::"public"."events_recurring_type_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."recurring_type_enum_old"`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_2c892a4523d070e7e343b6fadf1" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_e440f5b6332d3f8950941b2ccd2" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_e440f5b6332d3f8950941b2ccd2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_2c892a4523d070e7e343b6fadf1"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."recurring_type_enum_old" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "events" ALTER COLUMN "recurring_type" TYPE "public"."recurring_type_enum_old" USING "recurring_type"::"text"::"public"."recurring_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."events_recurring_type_enum"`);
    await queryRunner.query(
      `ALTER TYPE "public"."recurring_type_enum_old" RENAME TO "recurring_type_enum"`,
    );
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "family_id"`);
    await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "assignee_id"`);
    await queryRunner.query(
      `ALTER TABLE "events" ADD CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }
}
