import {
    MigrationInterface,
    QueryRunner
} from "typeorm";

export class addFixUserRelationship1681751075810 implements MigrationInterface {
    name = 'addFixUserRelationship1681751075810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "family_id" TYPE uuid USING family_id::uuid`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "family_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "fk_user_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "fk_device_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "fk_device_user"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "fk_user_family"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "family_id" SET NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "family_id" TYPE character varying`);
        await queryRunner.query(`ALTER TABLE "devices" ADD CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
