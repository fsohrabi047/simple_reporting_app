import {
  createParamDecorator,
  ExecutionContext
} from "@nestjs/common";
import { CurrentUserInterceptor } from "../interceptors/current-user.interceptor";

/**
 * Notice: We can't use DI in param decorators. If we need DI
 * we'll have to use an Interceptor.
 * @see CurrentUserInterceptor
 */
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.currentUser;
  }
);