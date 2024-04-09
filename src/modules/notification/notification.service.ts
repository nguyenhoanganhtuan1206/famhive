import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { I18nService } from 'nestjs-i18n';
import type { DeepPartial, FindManyOptions } from 'typeorm';
import {
  Between,
  In,
  IsNull,
  LessThanOrEqual,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';

import { RoleType } from '../../constants';
import type { ISendFirebaseMessages } from '../../shared/services/notification.service';
import { ScheduleService } from '../../shared/services/schedule.service';
import {
  endOfDay,
  getCurrentDateInUTC,
  startOfDay,
} from '../../utils/date.utils';
import { SendMailCommand } from '../mailer/commands/send-mail.command';
import { GetUsersCommand } from '../user/commands/get-users.command';
import type { UserEntity } from '../user/user.entity';
import { NotificationsService as SharedNotificationService } from './../../shared/services/notification.service';
import type { CreateNotificationDto } from './dto/create-notification.dto';
import type { NotificationDto } from './dto/notification.dto';
import type { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationByLocaleEntity } from './entities/notification-by-locale.entity';
import { NotificationForType } from './types/notification-for.type';
import { NotificationStatusType } from './types/notification-status.type';
import { NotificationType } from './types/notification-type';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntity)
    private notificationRepository: Repository<NotificationEntity>,
    @InjectRepository(NotificationByLocaleEntity)
    private readonly notificationByLocaleRepository: Repository<NotificationByLocaleEntity>,
    private commandBus: CommandBus,
    private sharedNotificationService: SharedNotificationService,
    private scheduleService: ScheduleService,
    private readonly i18nService: I18nService,
  ) {}

  async getAll(type: NotificationType): Promise<NotificationDto[]> {
    const notificationEntities = await this.notificationRepository.find({
      where: {
        type,
      },
      relations: {
        notificationByLocales: true,
      },
    });

    return notificationEntities.toDtos();
  }

  findOneById(id: Uuid, includeDetails = false) {
    return this.notificationRepository.findOneOrFail({
      where: { id },
      relations: {
        notificationByLocales: includeDetails,
      },
    });
  }

  async create(createNotificationDto: CreateNotificationDto) {
    this.verifySpecificType(createNotificationDto);
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      notificationByLocales: createNotificationDto.notificationByLocales.map(
        (item) =>
          this.notificationByLocaleRepository.create(
            item as DeepPartial<NotificationByLocaleEntity>,
          ),
      ),
    });

    const createdNotification = await this.notificationRepository.save(
      notification,
    );
    this.addCronJob(createdNotification);

    return createdNotification.toDto();
  }

  async update(id: Uuid, updateNotificationDto: UpdateNotificationDto) {
    const notification = await this.findOneById(id);

    if (notification.status === NotificationStatusType.DONE) {
      throw new BadRequestException(`Notification is already done`);
    }

    const hasUpdateScheduledTime =
      updateNotificationDto.scheduledDateTime &&
      updateNotificationDto.scheduledDateTime !==
        notification.scheduledDateTime;

    const updatedNotificationEntity = this.notificationRepository.create({
      ...notification,
      ...updateNotificationDto,
      notificationByLocales: updateNotificationDto.notificationByLocales.map(
        (notificationByLocale) => {
          if (!notificationByLocale.id) {
            delete notificationByLocale.id;
          }

          return this.notificationByLocaleRepository.create(
            notificationByLocale as DeepPartial<NotificationByLocaleEntity>,
          );
        },
      ),
    });

    const updatedNotification = await this.notificationRepository.save(
      updatedNotificationEntity,
    );

    if (hasUpdateScheduledTime) {
      this.addCronJob(updatedNotification);
    }

    return updatedNotification;
  }

  private verifySpecificType(notification: CreateNotificationDto) {
    if (
      notification.to === NotificationForType.SPECIFIC &&
      notification.specificEmails.length === 0
    ) {
      throw new BadRequestException(
        'Type is specific but no email was specific',
      );
    }
  }

  async remove(id: Uuid) {
    const notification = await this.findOneById(id);

    await this.notificationRepository.delete(notification.id);
    const jobName = this.generateCronjobName(notification.id);
    this.scheduleService.removeCronjob(jobName);
  }

  private async updateStatus(
    notification: NotificationEntity,
    status: NotificationStatusType,
  ) {
    return this.notificationRepository.save({
      ...notification,
      status,
    });
  }

  async handleAddCronjobForScheduledNotifications() {
    const notifications = await this.getScheduledNotifications();

    Logger.log(`Handle scheduled ${notifications.length} notifications`);

    for (const notification of notifications) {
      this.addCronJob(notification);
    }
  }

  private addCronJob(notification: NotificationEntity) {
    const jobName = this.generateCronjobName(notification.id);

    this.scheduleService.addCronJob(
      jobName,
      notification.scheduledDateTime,
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async () => {
        await this.sendViaEmailAndPushNotification(notification.id);
      },
    );
  }

  async sendViaEmailAndPushNotification(id: Uuid) {
    const notification = await this.findOneById(id, true);

    try {
      const users = await this.getRecipients(notification);

      if (notification.type === NotificationType.EMAIL) {
        await this.sendViaEmail(notification, users);
      }

      if (notification.type === NotificationType.PUSH_NOTIFICATION) {
        await this.sendViaPushNotifications(notification, users);
      }

      await this.updateStatus(notification, NotificationStatusType.DONE);
    } catch (error) {
      Logger.error(`Job send notification ${id} got the error: ${error}`);
      await this.updateStatus(notification, NotificationStatusType.CANCELLED);
    }
  }

  private async sendViaEmail(
    notification: NotificationEntity,
    users: UserEntity[],
  ) {
    await Promise.all(
      users.map(async (user) => {
        const notificationByLocale = notification.notificationByLocales.find(
          (item) => item.langCode === user.langCode,
        );

        if (notificationByLocale) {
          await this.commandBus.execute(
            new SendMailCommand({
              to: user.email,
              subject: notificationByLocale.title,
              templateName: 'notifications',
              data: {
                title: notificationByLocale.title,
                fullName: user.fullName,
                content: notificationByLocale.content,
                dear: this.i18nService.t('notification.dear', {
                  lang: user.langCode,
                }),
                bestRegards: this.i18nService.t('notification.best_regards', {
                  lang: user.langCode,
                }),
                famhiveTeam: this.i18nService.t('notification.famhive_team', {
                  lang: user.langCode,
                }),
              },
            }),
          );
        }
      }),
    );
  }

  private async sendViaPushNotifications(
    notification: NotificationEntity,
    users: UserEntity[],
  ) {
    const messages = this.notificationsToFirebaseMessages(notification, users);

    if (messages.length === 0) {
      return;
    }

    Logger.log('sendNotificationsViaPushNotifications', messages);
    await this.sharedNotificationService.sendFirebaseMessages(messages);
  }

  private notificationsToFirebaseMessages(
    notification: NotificationEntity,
    users: UserEntity[],
  ): ISendFirebaseMessages[] {
    const messages: ISendFirebaseMessages[] = [];
    // eslint-disable-next-line unicorn/no-array-for-each
    users.forEach((member) => {
      // eslint-disable-next-line unicorn/no-array-for-each
      member.devices?.forEach((device) => {
        const notificationByLocale = notification.notificationByLocales.find(
          (item) => item.langCode === member.langCode,
        );

        if (device.token !== undefined && notificationByLocale) {
          messages.push({
            token: device.token,
            title: notificationByLocale.title,
            message: notificationByLocale.content,
            customData: { type: 'notice', id: notification.id },
          });
        }
      });
    });

    return messages;
  }

  private async getRecipients(
    notification: NotificationEntity,
  ): Promise<UserEntity[]> {
    const { to, notificationByLocales, specificEmails } = notification;
    const options: FindManyOptions<UserEntity> = {
      relations: {
        devices: true,
        family: true,
      },
      where: {
        verified: true,
        role: In([RoleType.SUPERUSER, RoleType.ADMIN, RoleType.SPOUSE]),
        langCode: In(
          notificationByLocales.map(
            (notificationByLocale) => notificationByLocale.langCode,
          ),
        ),
      },
      order: {
        createdAt: 'ASC',
      },
    };

    if (to === NotificationForType.PREMIUM_USER) {
      options.where = {
        ...options.where,
        family: {
          productId: Not(IsNull()),
          expiresDate: MoreThanOrEqual(new Date()),
        },
      };
    }

    if (to === NotificationForType.NORMAL_USER) {
      options.where = {
        ...options.where,
        family: [
          {
            productId: IsNull(),
          },
          {
            expiresDate: LessThanOrEqual(new Date()),
          },
        ],
      };
    }

    if (to === NotificationForType.SUPER_USER) {
      options.where = {
        ...options.where,
        role: RoleType.SUPERUSER,
      };
    }

    if (to === NotificationForType.SPECIFIC) {
      options.where = {
        ...options.where,
        email: In(specificEmails),
      };
    }

    return this.commandBus.execute(new GetUsersCommand(options));
  }

  private generateCronjobName(notificationId: Uuid) {
    return `CronJobNotification-${notificationId}`;
  }

  private async getScheduledNotifications(): Promise<NotificationEntity[]> {
    const todayDate = getCurrentDateInUTC();

    return this.notificationRepository.findBy({
      status: NotificationStatusType.PENDING,
      scheduledDateTime: Between(startOfDay(todayDate), endOfDay(todayDate)),
    });
  }
}
