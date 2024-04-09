import { MigrationInterface, QueryRunner } from "typeorm";

export class updateTodo1679992269122 implements MigrationInterface {
    name = 'updateTodo1679992269122'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP CONSTRAINT "FK_31317705e16ae72e98f9a66cee4"`);
        await queryRunner.query(`ALTER TABLE "todos" RENAME COLUMN "owner_id" TO "family_id"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "family_id"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "family_id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "family_id"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD "family_id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "todos" RENAME COLUMN "family_id" TO "owner_id"`);
        await queryRunner.query(`ALTER TABLE "todos" ADD CONSTRAINT "FK_31317705e16ae72e98f9a66cee4" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
