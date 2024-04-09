import { MigrationInterface, QueryRunner } from "typeorm";

export class addChoreIconColor1712547915988 implements MigrationInterface {
    name = 'addChoreIconColor1712547915988'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chores" ADD "icon_color" character varying NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "chores" DROP COLUMN "icon_color"`);
    }

}
