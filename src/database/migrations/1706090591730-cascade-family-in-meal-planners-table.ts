import { MigrationInterface, QueryRunner } from "typeorm";

export class cascadeFamilyInMealPlannersTable1706090591730 implements MigrationInterface {
    name = 'cascadeFamilyInMealPlannersTable1706090591730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal-planners" DROP CONSTRAINT "fk_meal_planner_family"`);
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "fk_meal_family"`);
        await queryRunner.query(`ALTER TABLE "meal-planners" ADD CONSTRAINT "fk_meal_planner_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "fk_meal_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meals" DROP CONSTRAINT "fk_meal_family"`);
        await queryRunner.query(`ALTER TABLE "meal-planners" DROP CONSTRAINT "fk_meal_planner_family"`);
        await queryRunner.query(`ALTER TABLE "meals" ADD CONSTRAINT "fk_meal_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "meal-planners" ADD CONSTRAINT "fk_meal_planner_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
