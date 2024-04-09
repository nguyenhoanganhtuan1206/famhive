import { MigrationInterface, QueryRunner } from "typeorm";

export class addSpecificEmailsToAnnouncementsTable1704879817080 implements MigrationInterface {
    name = 'addSpecificEmailsToAnnouncementsTable1704879817080'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "announcements" ADD "specific_emails" text array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "announcements" DROP COLUMN "specific_emails"`);
    }

}
