import { MigrationInterface, QueryRunner } from "typeorm";

export class addContacts1698721630571 implements MigrationInterface {
    name = 'addContacts1698721630571'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "family_id" uuid NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "phone" character varying NOT NULL, "job_title" character varying NOT NULL, "email" character varying, "address" character varying NOT NULL, "birthday" TIMESTAMP NOT NULL, "company_name" character varying NOT NULL, "notes" character varying NOT NULL, "avatar" character varying, CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contacts" ADD CONSTRAINT "fk_contact_family" FOREIGN KEY ("family_id") REFERENCES "families"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contacts" DROP CONSTRAINT "fk_contact_family"`);
        await queryRunner.query(`DROP TABLE "contacts"`);
    }

}
