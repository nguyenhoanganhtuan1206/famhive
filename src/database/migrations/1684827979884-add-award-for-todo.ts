import { MigrationInterface, QueryRunner } from "typeorm";

export class addAwardForTodo1684827979884 implements MigrationInterface {
    name = 'addAwardForTodo1684827979884'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ADD "award" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "award"`);
    }

}
