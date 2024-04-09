import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultStarOfTasks1686552701000 implements MigrationInterface {
    name = 'SetDefaultStarOfTasks1686552701000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "todos" SET action_plan = 'create_first_event' WHERE action_plan = 'create_event'`);
        await queryRunner.query(`UPDATE "todos" SET award = 1 WHERE action_plan in ('create_first_event', 'create_first_spouse_or_kids', 'create_first_buy')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "todos" SET award = 0 WHERE action_plan in ('create_first_event', 'create_first_spouse_or_kids', 'create_first_buy')`);
    }

}
