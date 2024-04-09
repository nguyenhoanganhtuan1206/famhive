import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventTable implements MigrationInterface {
  name = 'createEventTable1680153820495';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TYPE \"recurring_type_enum\" AS ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY')",
    );

    await queryRunner.query(`
      CREATE TABLE "events"
      (
        "id"                uuid                NOT NULL DEFAULT uuid_generate_v4(),
        "created_at"        TIMESTAMP           NOT NULL DEFAULT now(),
        "updated_at"        TIMESTAMP           NOT NULL DEFAULT now(),
        "title"             character varying   NOT NULL,
        "color"             character varying,
        "start_date_time"   TIMESTAMP           NOT NULL,
        "end_date_time"     TIMESTAMP,
        "is_allday"         boolean             NOT NULL,
        "is_recurring"      boolean             NOT NULL,
        "recurring_type"    recurring_type_enum,
        "rrule"             character varying,
        "parent_id"         uuid,
        "owner_id"          uuid,
        CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id")
      )`);

    await queryRunner.query(`
      ALTER TABLE "events"
      ADD CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b"
      FOREIGN KEY ("owner_id")
      REFERENCES "users"("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "events" DROP CONSTRAINT "FK_09f256fb7f9a05f0ed9927f406b"`,
    );
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query('DROP TYPE "recurring_type_enum"');
  }
}
