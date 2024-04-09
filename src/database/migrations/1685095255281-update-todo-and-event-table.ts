import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTodoAndEventTable1685095255281 implements MigrationInterface {
    name = 'updateTodoAndEventTable1685095255281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "is_auto_generated" SET NOT NULL`);
        await queryRunner.query(`UPDATE "todos" SET "award" = 0 WHERE "award" is null`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "award" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "is_auto_generated" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "is_auto_generated" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todos" ALTER COLUMN "award" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "is_auto_generated" DROP NOT NULL`);
    }

}
