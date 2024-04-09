import { MigrationInterface, QueryRunner } from "typeorm";

export class addRecommendation1687021828341 implements MigrationInterface {
    name = 'addRecommendation1687021828341'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."questions_type_enum" AS ENUM('SINGLE_CHOICE', 'MULTI_CHOICE')`);
        await queryRunner.query(`CREATE TABLE "questions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "enabled" boolean NOT NULL, "type" "public"."questions_type_enum" NOT NULL DEFAULT 'SINGLE_CHOICE', CONSTRAINT "PK_08a6d4b0f49ff300bf3a0ca60ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "options" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "question_id" uuid NOT NULL, CONSTRAINT "PK_d232045bdb5c14d932fba18d957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "question_id" uuid NOT NULL, CONSTRAINT "PK_9c32cec6c71e06da0254f2226c6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ingredients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "dish_id" uuid NOT NULL, CONSTRAINT "PK_9240185c8a5507251c9f15e0649" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "dishes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "enabled" boolean NOT NULL, CONSTRAINT "PK_f4748c8e8382ad34ef517520b7b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer_options" ("answers_id" uuid NOT NULL, "options_id" uuid NOT NULL, CONSTRAINT "PK_59f36980fa50bafb486835456ca" PRIMARY KEY ("answers_id", "options_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_211220ec27949a5609304e7576" ON "answer_options" ("answers_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_bb5a5a99244a999534e89173ed" ON "answer_options" ("options_id") `);
        await queryRunner.query(`ALTER TABLE "options" ADD CONSTRAINT "option_question_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "answer_user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "answers" ADD CONSTRAINT "answer_question_fk" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE RESTRICT`);
        await queryRunner.query(`ALTER TABLE "ingredients" ADD CONSTRAINT "dish_ingredient_fk" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "answer_options" ADD CONSTRAINT "FK_211220ec27949a5609304e75760" FOREIGN KEY ("answers_id") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "answer_options" ADD CONSTRAINT "FK_bb5a5a99244a999534e89173ed2" FOREIGN KEY ("options_id") REFERENCES "options"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer_options" DROP CONSTRAINT "FK_bb5a5a99244a999534e89173ed2"`);
        await queryRunner.query(`ALTER TABLE "answer_options" DROP CONSTRAINT "FK_211220ec27949a5609304e75760"`);
        await queryRunner.query(`ALTER TABLE "ingredients" DROP CONSTRAINT "dish_ingredient_fk"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "answer_question_fk"`);
        await queryRunner.query(`ALTER TABLE "answers" DROP CONSTRAINT "answer_user_fk"`);
        await queryRunner.query(`ALTER TABLE "options" DROP CONSTRAINT "option_question_fk"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bb5a5a99244a999534e89173ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_211220ec27949a5609304e7576"`);
        await queryRunner.query(`DROP TABLE "answer_options"`);
        await queryRunner.query(`DROP TABLE "dishes"`);
        await queryRunner.query(`DROP TABLE "ingredients"`);
        await queryRunner.query(`DROP TABLE "answers"`);
        await queryRunner.query(`DROP TABLE "options"`);
        await queryRunner.query(`DROP TABLE "questions"`);
        await queryRunner.query(`DROP TYPE "public"."questions_type_enum"`);
    }
}