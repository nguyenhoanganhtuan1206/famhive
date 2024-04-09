import { MigrationInterface, QueryRunner } from "typeorm"

export class updateKids1700647267912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "users" SET activated = false WHERE role = 'KID'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
