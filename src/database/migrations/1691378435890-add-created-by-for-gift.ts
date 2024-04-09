import { MigrationInterface, QueryRunner } from "typeorm";

export class addCreatedByForGift1691378435890 implements MigrationInterface {
    name = 'addCreatedByForGift1691378435890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gift-redemptions" DROP CONSTRAINT "fk_gift-redemption_family"`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" ADD "created_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "gifts" ADD "created_by_id" uuid`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" ADD CONSTRAINT "fk_gift_redemption_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" ADD CONSTRAINT "fk_gift_redemption_user" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gifts" ADD CONSTRAINT "fk_gift_user" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gifts" DROP CONSTRAINT "fk_gift_user"`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" DROP CONSTRAINT "fk_gift_redemption_user"`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" DROP CONSTRAINT "fk_gift_redemption_family"`);
        await queryRunner.query(`ALTER TABLE "gifts" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" DROP COLUMN "created_by_id"`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" ADD CONSTRAINT "fk_gift-redemption_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
