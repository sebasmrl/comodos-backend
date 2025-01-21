import { applyDecorators,  UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export const RefreshAuth = (...args: string[])=>{
    return applyDecorators(
        UseGuards(AuthGuard('jwt-refresh'))
    );
}