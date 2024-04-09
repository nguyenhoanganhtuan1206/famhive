import { MigrationInterface, QueryRunner } from "typeorm";

export class createMealsTable1704356835271 implements MigrationInterface {
    name = 'createMealsTable1704356835271'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."meal-planners_type_enum" AS ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACKS')`);
        await queryRunner.query(`CREATE TABLE "meal-planners" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "type" "public"."meal-planners_type_enum" NOT NULL, "meals" character varying array NOT NULL, "family_id" uuid NOT NULL, CONSTRAINT "PK_8f032034b70995a581f8887d08c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "meals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "family_id" uuid, CONSTRAINT "PK_e6f830ac9b463433b58ad6f1a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "meal-planners" ADD CONSTRAINT "fk_meal_planner_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "fk_meal_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "fk_meal_family"`);
        await queryRunner.query(`ALTER TABLE "meal-planners" DROP CONSTRAINT "fk_meal_planner_family"`);
        await queryRunner.query(`DROP TABLE "meals"`);
        await queryRunner.query(`DROP TABLE "meal-planners"`);
        await queryRunner.query(`DROP TYPE "public"."meal-planners_type_enum"`);
    }

}
