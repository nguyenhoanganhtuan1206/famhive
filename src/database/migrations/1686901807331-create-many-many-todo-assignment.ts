import { MigrationInterface, QueryRunner } from "typeorm";

export class createManyManyTodoAssignment1686901807331 implements MigrationInterface {
    name = 'createManyManyTodoAssignment1686901807331'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_assignee_user"`);
        await queryRunner.query(`
            CREATE TABLE "todos_assignees_users" (
                "todos_id" uuid NOT NULL,
                "users_id" uuid NOT NULL,
                CONSTRAINT "PK_992e2c15572d3a626ef2977369e" PRIMARY KEY ("todos_id", "users_id")
            )
        `);
        await queryRunner.query(`CREATE INDEX "IDX_f4fdda98210318a95329d10a6d" ON "todos_assignees_users" ("todos_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_fdf3a0137c79971cc296b20d0e" ON "todos_assignees_users" ("users_id") `);
        await queryRunner.query(`INSERT INTO "todos_assignees_users" ("todos_id", "users_id") SELECT id, assignee_id FROM "todos" WHERE assignee_id is not null`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "assignee_id"`);
        await queryRunner.query(`ALTER TABLE "todos_assignees_users" ADD CONSTRAINT "FK_f4fdda98210318a95329d10a6d6" FOREIGN KEY ("todos_id") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "todos_assignees_users" ADD CONSTRAINT "FK_fdf3a0137c79971cc296b20d0ea" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos_assignees_users" DROP CONSTRAINT "FK_fdf3a0137c79971cc296b20d0ea"`);
        await queryRunner.query(`ALTER TABLE "todos_assignees_users" DROP CONSTRAINT "FK_f4fdda98210318a95329d10a6d6"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "assignee_id" uuid`);
        await queryRunner.query(`UPDATE "todos" SET assignee_id = "todos_assignees_users"."users_id" FROM "todos_assignees_users" WHERE "todos_assignees_users"."todos_id" = "todos"."id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fdf3a0137c79971cc296b20d0e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f4fdda98210318a95329d10a6d"`);
        await queryRunner.query(`DROP TABLE "todos_assignees_users"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_assignee_user" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
    }

}
