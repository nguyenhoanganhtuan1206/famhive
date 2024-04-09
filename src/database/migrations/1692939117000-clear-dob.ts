import { MigrationInterface, QueryRunner } from "typeorm";

export class clearDob1692939117000 implements MigrationInterface {
    name = 'clearDob1692939117000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM events
            WHERE event_type = 'birthday' and NOT EXISTS (
                SELECT 1
                FROM events_assignees_users
                WHERE events.id = events_assignees_users.events_id
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {}
}
