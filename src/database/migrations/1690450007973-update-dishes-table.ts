import { MigrationInterface, QueryRunner } from "typeorm";

export class updateDishesTable1690450007973 implements MigrationInterface {
    name = 'updateDishesTable1690450007973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dishes" ADD "language" character varying NOT NULL DEFAULT 'English'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dishes" DROP COLUMN "language"`);
    }

}
