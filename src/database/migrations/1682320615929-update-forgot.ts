import { MigrationInterface, QueryRunner } from "typeorm";

export class updateForgot1682320615929 implements MigrationInterface {
    name = 'updateForgot1682320615929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot" DROP CONSTRAINT "FK_c3c33f5755163b3fa260c55e439"`);
        await queryRunner.query(`ALTER TABLE "forgot" ADD CONSTRAINT "fk_forgot_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot" DROP CONSTRAINT "fk_forgot_user"`);
        await queryRunner.query(`ALTER TABLE "forgot" ADD CONSTRAINT "FK_c3c33f5755163b3fa260c55e439" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
