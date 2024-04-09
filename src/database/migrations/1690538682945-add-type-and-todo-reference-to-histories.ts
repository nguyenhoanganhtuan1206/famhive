import { MigrationInterface, QueryRunner } from "typeorm";

export class addTypeAndTodoReferenceToHistories1690538682945 implements MigrationInterface {
    name = 'addTypeAndTodoReferenceToHistories1690538682945'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."redemption_histories_type_enum" AS ENUM('EARNED', 'REVOKED', 'DEDUCTED', 'REDEEMED')`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" ADD "type" "public"."redemption_histories_type_enum" NOT NULL DEFAULT 'REDEEMED'`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" ADD "todo_id" uuid`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" ADD CONSTRAINT "fk_history_todo" FOREIGN KEY ("todo_id") REFERENCES "todos"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "redemption_histories" DROP CONSTRAINT "fk_history_todo"`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" DROP COLUMN "todo_id"`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."redemption_histories_type_enum"`);
    }

}
