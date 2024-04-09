import { MigrationInterface, QueryRunner } from "typeorm";

export class addUserConfiguration1695699979996 implements MigrationInterface {
    name = 'addUserConfiguration1695699979996'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user-configurations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_show_todo_done" boolean NOT NULL DEFAULT true, "is_show_task_done" boolean NOT NULL DEFAULT true, "user_id" uuid NOT NULL, CONSTRAINT "REL_01f8c01160f2dd2bea25af14b4" UNIQUE ("user_id"), CONSTRAINT "PK_1a166306e431053dee9b21aa1d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user-configurations" ADD CONSTRAINT "fk_configuration_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user-configurations" DROP CONSTRAINT "fk_configuration_user"`);
        await queryRunner.query(`DROP TABLE "user-configurations"`);
    }

}
