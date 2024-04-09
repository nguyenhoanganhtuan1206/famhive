import { MigrationInterface, QueryRunner } from "typeorm";

export class addSendToLanguageToNotification1696475062597 implements MigrationInterface {
    name = 'addSendToLanguageToNotification1696475062597'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "send_to_lang_codes" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "send_to_lang_codes"`);
    }

}
