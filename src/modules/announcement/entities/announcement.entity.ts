import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { AnnouncementForUserType } from '../constants/announcement-for-user-type';
import { ScreenName } from '../constants/screen-name';
import { AnnouncementDto } from '../dto/announcement.dto';
import { AnnouncementByLocaleEntity } from './announcement-by-locale.entity';

@Entity('announcements')
@UseDto(AnnouncementDto)
export class AnnouncementEntity extends AbstractEntity<AnnouncementDto> {
  @Column()
  title: string;

  @Column()
  startDateTime: Date;

  @Column()
  endDateTime: Date;

  @Column()
  to: AnnouncementForUserType;

  @Column({ default: false })
  enabled: boolean;

  @Column()
  redirectToScreen: ScreenName;

  @Column({
    type: 'text',
    array: true,
    default: '{}',
  })
  specificEmails: string[];

  @OneToMany(
    () => AnnouncementByLocaleEntity,
    (announcementByLocale) => announcementByLocale.announcement,
    {
      cascade: true,
    },
  )
  announcementByLocales: AnnouncementByLocaleEntity[];
}
