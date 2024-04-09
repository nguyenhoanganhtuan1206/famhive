import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException, createParamDecorator } from '@nestjs/common';
import _ from 'lodash';

import { TodoType } from '../types/todo.type';

export function ParamTodoType() {
  return createParamDecorator((name = 'type', context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const type = request.params[name];

    if (!_.includes(_.keys(TodoType), type)) {
      throw new BadRequestException('Invalid TodoType');
    }

    return type;
  })();
}
