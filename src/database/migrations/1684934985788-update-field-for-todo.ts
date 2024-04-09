import { MigrationInterface, QueryRunner } from "typeorm";

export class updateFieldForTodo1684934985788 implements MigrationInterface {
    name = 'updateFieldForTodo1684934985788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ADD "is_auto_generated" boolean DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "action_plan" character DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "award" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "award" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "action_plan"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "is_auto_generated"`);
    }

}
