import { NumberField } from '../../../decorators';
import type { UserEntity } from '../user.entity';
import { UserRef } from './user-ref';

export class UserBalanceDto extends UserRef {
  @NumberField()
  balance: number;

  constructor(userEntity: UserEntity, rewardType: string) {
    super(userEntity);
    this.balance =
      rewardType === 'star' ? userEntity.balanceStar : userEntity.balanceMoney;
  }

  static toUserBalanceDto(userEntity: UserEntity, rewardType: string) {
    return new UserBalanceDto(userEntity, rewardType);
  }

  static toUserBalanceDtos(userEntities: UserEntity[], rewardType: string) {
    return userEntities.map((userEntity) =>
      UserBalanceDto.toUserBalanceDto(userEntity, rewardType),
    );
  }
}
