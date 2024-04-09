import { MigrationInterface, QueryRunner } from "typeorm";

export class fixDeleteTodoCategory1688294156829 implements MigrationInterface {
    name = 'fixDeleteTodoCategory1688294156829'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_todo_category"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_todo_category" FOREIGN KEY ("category_id") REFERENCES "todo_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_todo_category"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_todo_category" FOREIGN KEY ("category_id") REFERENCES "todo_categories"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
    }

}
