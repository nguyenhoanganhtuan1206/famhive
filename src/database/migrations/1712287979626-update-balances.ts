import { MigrationInterface, QueryRunner } from "typeorm";

export class updateBalances1712287979626 implements MigrationInterface {
    name = 'updateBalances1712287979626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance_histories" DROP COLUMN "create_by_id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "balance_star" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "balance_money" numeric NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "chores" ALTER COLUMN "reward_star" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chores" ALTER COLUMN "reward_money" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ALTER COLUMN "amount_star" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ALTER COLUMN "amount_money" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "balance_histories" ALTER COLUMN "amount_money" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ALTER COLUMN "amount_star" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chores" ALTER COLUMN "reward_money" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "chores" ALTER COLUMN "reward_star" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance_money"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "balance_star"`);
        await queryRunner.query(`ALTER TABLE "balance_histories" ADD "create_by_id" character varying`);
    }

}
