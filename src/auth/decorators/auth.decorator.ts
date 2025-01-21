import { applyDecorators,  UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const Auth = (...args: string[])=>{
    return applyDecorators(
        UseGuards(AuthGuard('jwt-access'))
    );
     // SetMetadata('auth', args);
}
