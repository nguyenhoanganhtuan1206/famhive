import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTodo1680016982095 implements MigrationInterface {
    name = 'updateTodo1680016982095'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "family_id"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "family_id" uuid`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "FK_d5b5aa703508a177621b3c66a37" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "FK_d5b5aa703508a177621b3c66a37"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "family_id"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "family_id" character varying`);
    }

}
