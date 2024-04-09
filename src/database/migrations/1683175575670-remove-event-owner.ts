import { MigrationInterface, QueryRunner } from "typeorm";

export class removeEventOwner1683175575670 implements MigrationInterface {
    name = 'removeEventOwner1683175575670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "fk_event_owner_user"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "owner_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ADD "owner_id" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "fk_event_owner_user" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
