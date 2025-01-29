import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ValidRolesGuard implements CanActivate {

  constructor(
    @Inject()
    private  readonly reflector: Reflector,             //permite ver informacion de metadata de donde se este llamando
  ){}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest();
    const validRoles:string[] = this.reflector.get(META_ROLES, context.getHandler());

    //Para endpoints publicos validRoles = [] no no se envía
    if(!validRoles) return true; 
    if(validRoles.length===0) return true;

    const user:User = req.user;
    if(!user) throw new ForbiddenException('Necesitas estar autenticado para acceder a este recurso')

    if(validRoles.filter( role=> user.roles.includes(role)).length >0 ) return true
    throw new ForbiddenException(`Lo sentimos ${user.names}, pero no cuentas con el rol de acceso a este recurso `)
  }
}
