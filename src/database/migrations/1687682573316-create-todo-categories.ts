import { MigrationInterface, QueryRunner } from "typeorm";

export class createTodoCategories1687682573316 implements MigrationInterface {
    name = 'createTodoCategories1687682573316'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "todo_categories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "family_id" character varying NOT NULL,
                CONSTRAINT "PK_9222f151ba574f8befbd7afe936" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`ALTER TABLE "todos" ADD "category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "fk_todo_todo_categories" FOREIGN KEY ("category_id") REFERENCES "todo_categories"("id") ON DELETE SET NULL ON UPDATE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "fk_todo_todo_categories"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "category_id"`);
        await queryRunner.query(`DROP TABLE "todo_categories"`);
    }

}
