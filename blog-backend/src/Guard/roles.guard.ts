import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';


@Injectable()
export class RolesGuard implements CanActivate{
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean {
    //1.Get roles from metadata    
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    //2.Get user from request    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    //3.Check if user has role    
    const hasRole = roles.some((role) => user.role === role);
    return hasRole;
  }
}
