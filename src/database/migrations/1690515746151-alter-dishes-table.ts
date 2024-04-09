import { MigrationInterface, QueryRunner } from "typeorm";

export class alterDishesTable1690515746151 implements MigrationInterface {
    name = 'alterDishesTable1690515746151'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "dishes" SET "language" = 'en'`);
        await queryRunner.query(`ALTER TABLE "dishes" ALTER COLUMN "language" SET DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "dishes" ALTER COLUMN "language" SET DEFAULT 'English'`);
    }

}
