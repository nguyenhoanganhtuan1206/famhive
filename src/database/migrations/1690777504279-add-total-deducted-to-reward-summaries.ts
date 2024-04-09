import { MigrationInterface, QueryRunner } from "typeorm";

export class addTotalDeductedToRewardSummaries1690777504279 implements MigrationInterface {
    name = 'addTotalDeductedToRewardSummaries1690777504279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward_summaries" ADD "total_deducted" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward_summaries" DROP COLUMN "total_deducted"`);
    }

}
