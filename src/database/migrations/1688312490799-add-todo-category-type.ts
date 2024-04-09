import { MigrationInterface, QueryRunner } from "typeorm";

export class addTodoCategoryType1688312490799 implements MigrationInterface {
    name = 'addTodoCategoryType1688312490799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."todo_categories_type_enum" AS ENUM('BUY', 'TASK')`);
        await queryRunner.query(`ALTER TABLE "todo_categories" ADD "type" "public"."todo_categories_type_enum" NOT NULL DEFAULT 'TASK'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo_categories" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."todo_categories_type_enum"`);
    }

}
