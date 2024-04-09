import type { MigrationInterface, QueryRunner } from "typeorm";

export class AddDeviceTable1680865612614 implements MigrationInterface {
    name = 'addDeviceTable1680865612614'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`CREATE TABLE "devices" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "name" character varying,
        "identifier" character varying NOT NULL,
        "token" character varying,
        "user_id" uuid NOT NULL,
        CONSTRAINT "UQ_01157b829735c0b390f3bbab1c0" UNIQUE ("identifier"),
        CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`,
      );

      await queryRunner.query(`ALTER TABLE "devices"
        ADD CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c"
        FOREIGN KEY ("user_id") REFERENCES "users"("id")
        ON DELETE NO ACTION
        ON UPDATE NO ACTION`
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "devices" DROP CONSTRAINT "FK_5e9bee993b4ce35c3606cda194c"`);
        await queryRunner.query(`DROP TABLE "devices"`);
    }

}
