import { MigrationInterface, QueryRunner } from "typeorm";

export class createTableForRewardModule1685429175592 implements MigrationInterface {
    name = 'createTableForRewardModule1685429175592'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "redemption_histories" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "user_id" uuid NOT NULL,
                "amount" integer NOT NULL,
                "description" character varying NOT NULL,
                "created_by_id" uuid,
                CONSTRAINT "PK_3a991b62d916ff30e2bb928eb8a" PRIMARY KEY ("id")
            )`
        );
        await queryRunner.query(`
            CREATE TABLE "reward_summaries" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "total_received" integer NOT NULL DEFAULT '0',
                "total_redeemed" integer NOT NULL DEFAULT '0',
                "user_id" uuid NOT NULL,
                CONSTRAINT "REL_0962678898ccd6860aac4c74c5" UNIQUE ("user_id"),
                CONSTRAINT "PK_5117aaa0d2e16ce9a01356ff29b" PRIMARY KEY ("id")
            )`
        );
        await queryRunner.query(`ALTER TABLE "redemption_histories" ADD CONSTRAINT "fk_redeemed_history_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" ADD CONSTRAINT "fk_create_by_redeemed_history_user" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reward_summaries" ADD CONSTRAINT "fk_reward_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reward_summaries" DROP CONSTRAINT "fk_reward_user"`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" DROP CONSTRAINT "fk_create_by_redeemed_history_user"`);
        await queryRunner.query(`ALTER TABLE "redemption_histories" DROP CONSTRAINT "fk_redeemed_history_user"`);
        await queryRunner.query(`DROP TABLE "reward_summaries"`);
        await queryRunner.query(`DROP TABLE "redemption_histories"`);
    }

}
