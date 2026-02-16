import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as { permissions?: string[] } | undefined;

    if (!user?.permissions) {
      throw new ForbiddenException('Missing permissions');
    }

    const userPerms = new Set(user.permissions);
    const ok = required.every((p) => userPerms.has(p));

    if (!ok) throw new ForbiddenException('Insufficient permissions');
    return true;
  }
}
