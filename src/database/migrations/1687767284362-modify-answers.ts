import { MigrationInterface, QueryRunner } from "typeorm";

export class modifyAnswers1687767284362 implements MigrationInterface {
    name = 'modifyAnswers1687767284362'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" ADD "family_id" character varying NULL`);
        await queryRunner.query(`UPDATE "answers" AS a SET "family_id" = u."family_id" FROM "users" AS u WHERE u."id" = a."user_id"`);
        await queryRunner.query(`ALTER TABLE "answers" ALTER COLUMN "family_id" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answers" DROP COLUMN "family_id"`);
    }

}
