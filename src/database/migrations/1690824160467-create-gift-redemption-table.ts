import { MigrationInterface, QueryRunner } from "typeorm";

export class createGiftRedemptionTable1690824160467 implements MigrationInterface {
    name = 'createGiftRedemptionTable1690824160467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "gift-redemptions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "star" integer NOT NULL DEFAULT '0',
                "family_id" uuid NOT NULL,
                CONSTRAINT "PK_8876a70265f54bff2764012376f" PRIMARY KEY ("id")
            )`
        );
        await queryRunner.query(`
            CREATE TABLE "gift-redemptions_assignees_users" (
                "gift-redemptions_id" uuid NOT NULL,
                "users_id" uuid NOT NULL,
                CONSTRAINT "PK_9aeba65b65e76201248ab0162da" PRIMARY KEY ("gift-redemptions_id", "users_id")
            )`
        );
        await queryRunner.query(`CREATE INDEX "IDX_a4c069c4eaf4abb6cc06a50905" ON "gift-redemptions_assignees_users" ("gift-redemptions_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_19d57f2ca3804faaccc898551c" ON "gift-redemptions_assignees_users" ("users_id") `);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" ADD CONSTRAINT "fk_gift-redemption_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions_assignees_users" ADD CONSTRAINT "FK_a4c069c4eaf4abb6cc06a509057" FOREIGN KEY ("gift-redemptions_id") REFERENCES "gift-redemptions"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions_assignees_users" ADD CONSTRAINT "FK_19d57f2ca3804faaccc898551c6" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gift-redemptions_assignees_users" DROP CONSTRAINT "FK_19d57f2ca3804faaccc898551c6"`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions_assignees_users" DROP CONSTRAINT "FK_a4c069c4eaf4abb6cc06a509057"`);
        await queryRunner.query(`ALTER TABLE "gift-redemptions" DROP CONSTRAINT "fk_gift-redemption_family"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19d57f2ca3804faaccc898551c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a4c069c4eaf4abb6cc06a50905"`);
        await queryRunner.query(`DROP TABLE "gift-redemptions_assignees_users"`);
        await queryRunner.query(`DROP TABLE "gift-redemptions"`);
    }

}
