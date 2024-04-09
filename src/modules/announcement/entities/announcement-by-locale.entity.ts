import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LangCode } from '../../../constants';
import { UseDto } from '../../../decorators';
import { AnnouncementByLocaleDto } from '../dto/announcement-by-locale.dto';
import { AnnouncementEntity } from './announcement.entity';

@Entity('announcement-by-locales')
@UseDto(AnnouncementByLocaleDto)
export class AnnouncementByLocaleEntity extends AbstractEntity<AnnouncementByLocaleDto> {
  @Column()
  bannerUrl: string;

  @Column()
  textButton: string;

  @Column()
  langCode: LangCode;

  @Column()
  announcementId: Uuid;

  @ManyToOne(
    () => AnnouncementEntity,
    (announcement) => announcement.announcementByLocales,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    foreignKeyConstraintName: 'fk_announcement_by_local_announcement',
  })
  announcement: AnnouncementEntity;
}
