import { MigrationInterface, QueryRunner } from "typeorm";

export class addFixEventTodoRelationship1681752950051 implements MigrationInterface {
    name = 'addFixEventTodoRelationship1681752950051'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_2c892a4523d070e7e343b6fadf1"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_e440f5b6332d3f8950941b2ccd2"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "FK_6d7c3fd77573b5ecd5e1e83704d"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "FK_d5b5aa703508a177621b3c66a37"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "family_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "family_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "fk_event_owner_user" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "fk_event_assign_user" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "fk_event_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_assignee_user" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_family"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_assignee_user"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "fk_event_family"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "fk_event_assign_user"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "fk_event_owner_user"`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "family_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "family_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "FK_d5b5aa703508a177621b3c66a37" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "FK_6d7c3fd77573b5ecd5e1e83704d" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_e440f5b6332d3f8950941b2ccd2" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_2c892a4523d070e7e343b6fadf1" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
