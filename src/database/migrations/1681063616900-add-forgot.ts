import { MigrationInterface, QueryRunner } from "typeorm";

export class addForgot1681063616900 implements MigrationInterface {
    name = 'addForgot1681063616900'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "forgot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "user_id" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL, CONSTRAINT "REL_c3c33f5755163b3fa260c55e43" UNIQUE ("user_id"), CONSTRAINT "PK_087959f5bb89da4ce3d763eab75" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "forgot" ADD CONSTRAINT "FK_c3c33f5755163b3fa260c55e439" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "forgot" DROP CONSTRAINT "FK_c3c33f5755163b3fa260c55e439"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "verified" DROP DEFAULT`);
        await queryRunner.query(`DROP TABLE "forgot"`);
    }

}
