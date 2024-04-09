import {
    MigrationInterface,
    QueryRunner
} from "typeorm";

export class addActivated1681208279784 implements MigrationInterface {
    name = 'addActivated1681208279784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "activated" boolean DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "activated"`);
    }

}
