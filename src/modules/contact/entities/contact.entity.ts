// Reference
// https://vertabelo.com/blog/again-and-again-managing-recurring-contacts-in-a-data-model/
// https://www.nylas.com/blog/calendar-contacts-rrules/
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { FamilyEntity } from '../../family/entities/family.entity';
import { ContactDto } from '../dtos/contact.dto';
@Entity('contacts')
@UseDto(ContactDto)
export class ContactEntity extends AbstractEntity<ContactDto> {
  @Column()
  familyId: Uuid;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  phone: string;

  @Column()
  jobTitle: string;

  @Column({ nullable: true })
  email: string;

  @Column()
  address: string;

  @Column({ type: 'timestamp' })
  birthday: Date;

  @Column()
  companyName: string;

  @Column()
  notes: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => FamilyEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'fk_contact_family' })
  family: FamilyEntity;
}
