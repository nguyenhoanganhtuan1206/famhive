import { MigrationInterface, QueryRunner } from "typeorm";

export class changeEventIcons1685939452000 implements MigrationInterface {
    name = 'changeEventIcons1685939452000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "events" SET title = REPLACE(title, ':birthday:', '🎂') WHERE title like ':birthday:%'`);
        await queryRunner.query(`UPDATE "events" SET title = CONCAT('💝 ', title) WHERE title like 'Valentine%s Day'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "events" SET title = REPLACE(title, '🎂', ':birthday:') WHERE title like '🎂%'`);
        await queryRunner.query(`UPDATE "events" SET title = REPLACE(title, '💝 ', '') WHERE title like '💝 Valentine%s Day'`);
    }

}
