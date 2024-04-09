import { MigrationInterface, QueryRunner } from "typeorm";

export class addLanguageForUser1696304373803 implements MigrationInterface {
    name = 'addLanguageForUser1696304373803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "lang_code" character varying NOT NULL DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lang_code"`);
    }

}
