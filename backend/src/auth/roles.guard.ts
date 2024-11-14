import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log('Roles required for this route:', roles);

    if (!roles) {
      return true; // ロールが設定されていなければ全ユーザーにアクセス許可
    }

    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext().req.user;
    console.log('User in RolesGuard:', user);

    if (!user) {
      throw new Error('User not found in context. Authentication might have failed.');
    }

    return roles.includes(user.role); // ユーザーのロールが含まれていればアクセス許可
  }
}
