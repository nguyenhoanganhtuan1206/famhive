import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { UserEntity } from 'modules/user/user.entity';
import { ILike, Repository } from 'typeorm';

import type { ContactDto } from './dtos/contact.dto';
import type { CreateContactDto } from './dtos/create-contact.dto';
import type { GetContactsDto } from './dtos/get-contacts.dto';
import type { UpdateContactDto } from './dtos/update-contact.dto';
import { ContactEntity } from './entities/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactRepository: Repository<ContactEntity>,
  ) {}

  async createContact(
    createContactDto: CreateContactDto,
    user: UserEntity,
  ): Promise<ContactDto> {
    const contact = this.contactRepository.create({
      ...createContactDto,
      familyId: user.familyId,
    });
    await this.contactRepository.save(contact);

    return contact.toDto();
  }

  async getContacts(
    getContactDto: GetContactsDto,
    user: UserEntity,
  ): Promise<ContactDto[]> {
    const { search } = getContactDto;
    const contacts = await this.contactRepository.find({
      where: [
        {
          familyId: user.familyId,
          firstName: ILike(`%${search}%`),
        },
        {
          familyId: user.familyId,
          lastName: ILike(`%${search}%`),
        },
        {
          familyId: user.familyId,
          phone: ILike(`%${search}%`),
        },
      ],
    });

    return contacts.toDtos();
  }

  findOneOrFail(id: Uuid, user: UserEntity): Promise<ContactEntity> {
    return this.contactRepository.findOneOrFail({
      where: { id, familyId: user.familyId },
    });
  }

  async updateContact(
    updateContactDto: UpdateContactDto,
    contactId: Uuid,
    user: UserEntity,
  ): Promise<ContactDto> {
    const contactEntity = await this.findOneOrFail(contactId, user);
    this.contactRepository.merge(contactEntity, updateContactDto);
    const updatedContactEntity = await this.contactRepository.save(
      contactEntity,
    );

    return updatedContactEntity.toDto();
  }

  async deleteContact(contactId: Uuid, user: UserEntity): Promise<void> {
    const contactEntity = await this.findOneOrFail(contactId, user);

    await this.contactRepository.delete(contactEntity.id);
  }
}
