import { MigrationInterface, QueryRunner } from "typeorm"

export class removePost1679673347651 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE "post_translations"`,
    );
    await queryRunner.query(
      `DROP TABLE "posts"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
  }

}
