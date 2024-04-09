import type { UserEntity } from '../user.entity';

export class UserRef {
  id: Uuid;

  fullName: string | undefined;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.fullName = user.fullName;
  }
}
