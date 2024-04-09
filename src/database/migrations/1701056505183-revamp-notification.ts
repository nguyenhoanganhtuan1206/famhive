import { MigrationInterface, QueryRunner } from "typeorm";

export class revampNotification1701056505183 implements MigrationInterface {
    name = 'revampNotification1701056505183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_type_enum" AS ENUM('EMAIL', 'PUSH_NOTIFICATION')`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "type" "public"."notifications_type_enum" NOT NULL DEFAULT 'EMAIL'`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "specific_emails" text array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TYPE "public"."notifications_to_enum" RENAME TO "notifications_to_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_to_enum" AS ENUM('ALL_USER', 'NORMAL_USER', 'PREMIUM_USER', 'SUPER_USER', 'SPECIFIC')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "to" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "to" TYPE "public"."notifications_to_enum" USING "to"::"text"::"public"."notifications_to_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "to" SET DEFAULT 'ALL_USER'`);
        await queryRunner.query(`DROP TYPE "public"."notifications_to_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."notifications_to_enum_old" AS ENUM('ALL_USER', 'NORMAL_USER', 'PREMIUM_USER')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "to" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "to" TYPE "public"."notifications_to_enum_old" USING "to"::"text"::"public"."notifications_to_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "to" SET DEFAULT 'ALL_USER'`);
        await queryRunner.query(`DROP TYPE "public"."notifications_to_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notifications_to_enum_old" RENAME TO "notifications_to_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "specific_emails"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_type_enum"`);
    }

}
