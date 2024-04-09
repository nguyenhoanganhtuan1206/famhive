import { MigrationInterface, QueryRunner } from "typeorm";

export class createGiftTable1690816772322 implements MigrationInterface {
    name = 'createGiftTable1690816772322'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "gifts" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "title" character varying NOT NULL,
                "star" integer NOT NULL DEFAULT '0',
                "family_id" uuid NOT NULL,
                CONSTRAINT "PK_54242922934e1f322861d116af7" PRIMARY KEY ("id")
            )`
        );
        await queryRunner.query(`ALTER TABLE "gifts" ADD CONSTRAINT "fk_gift_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gifts" DROP CONSTRAINT "fk_gift_family"`);
        await queryRunner.query(`DROP TABLE "gifts"`);
    }

}
