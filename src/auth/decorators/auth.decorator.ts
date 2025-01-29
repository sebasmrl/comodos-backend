import { applyDecorators,  UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { RoleProtected } from './role-protected.decorator';
import { ValidRolesGuard } from '../guards/valid-roles/valid-roles.guard';

export const Auth = (...roles: ValidRoles[])=>{
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard('jwt-access'), ValidRolesGuard)
    );
     // SetMetadata('auth', args);
}
