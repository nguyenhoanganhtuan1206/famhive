import { MigrationInterface, QueryRunner } from "typeorm";

export class createManyManyEventAssignment1687171608623 implements MigrationInterface {
    name = 'createManyManyEventAssignment1687171608623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "fk_event_assign_user"`);
        await queryRunner.query(`
            CREATE TABLE "events_assignees_users" (
                "events_id" uuid NOT NULL,
                "users_id" uuid NOT NULL,
                CONSTRAINT "PK_73957e50b049f4f18bcb8c66bba" PRIMARY KEY ("events_id", "users_id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_9acc612a1d71049049eb80736a" ON "events_assignees_users" ("events_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_adec5cc26ad2c68cf5352f6e84" ON "events_assignees_users" ("users_id") `);
        await queryRunner.query(`INSERT INTO "events_assignees_users" ("events_id", "users_id") SELECT id, assignee_id FROM "events" WHERE assignee_id is not null`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "assignee_id"`);
        await queryRunner.query(`ALTER TABLE "events_assignees_users" ADD CONSTRAINT "FK_9acc612a1d71049049eb80736a0" FOREIGN KEY ("events_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "events_assignees_users" ADD CONSTRAINT "FK_adec5cc26ad2c68cf5352f6e847" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events_assignees_users" DROP CONSTRAINT "FK_adec5cc26ad2c68cf5352f6e847"`);
        await queryRunner.query(`ALTER TABLE "events_assignees_users" DROP CONSTRAINT "FK_9acc612a1d71049049eb80736a0"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "assignee_id" uuid`);
        await queryRunner.query(`UPDATE "events" SET assignee_id = "events_assignees_users"."users_id" FROM "events_assignees_users" WHERE "events_assignees_users"."events_id" = "events"."id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_adec5cc26ad2c68cf5352f6e84"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9acc612a1d71049049eb80736a"`);
        await queryRunner.query(`DROP TABLE "events_assignees_users"`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "fk_event_assign_user" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
    }

}
