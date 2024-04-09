import { MigrationInterface, QueryRunner } from "typeorm";

export class chatgptRecommendation1687489479890 implements MigrationInterface {
    name = 'chatgptRecommendation1687489479890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "unit" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD "quantity" character varying NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "dishes" ADD "instructions" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dishes" DROP COLUMN "instructions"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP COLUMN "unit"`);
    }

}
