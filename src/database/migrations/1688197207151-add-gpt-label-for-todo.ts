import { MigrationInterface, QueryRunner } from "typeorm";

export class addGptLabelForTodo1688197207151 implements MigrationInterface {
    name = 'addGptLabelForTodo1688197207151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_todo_categories"`);
        await queryRunner.query(`ALTER TABLE "todo_categories" ADD "by_gpt" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "by_gpt" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_todo_category" FOREIGN KEY ("category_id") REFERENCES "todo_categories"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_todo_category"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "by_gpt"`);
        await queryRunner.query(`ALTER TABLE "todo_categories" DROP COLUMN "by_gpt"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_todo_categories" FOREIGN KEY ("category_id") REFERENCES "todo_categories"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
    }

}
