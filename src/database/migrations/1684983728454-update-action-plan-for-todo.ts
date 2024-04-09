import { MigrationInterface, QueryRunner } from "typeorm";

export class updateActionPlanTodo1684983727453 implements MigrationInterface {
    name = 'updateActionPlanTodo1684983727453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "action_plan" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "action_plan" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "action_plan" TYPE VARCHAR(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "action_plan" type character`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "action_plan" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "action_plan" SET NOT NULL`);
    }

}
