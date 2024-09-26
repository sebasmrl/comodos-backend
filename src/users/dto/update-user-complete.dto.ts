import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto";
import { IsBoolean, IsInt, IsOptional, Min } from "class-validator";

export class UpdateUserCompleteDto extends PartialType(CreateUserDto){

    @IsOptional()
    @IsBoolean()
    confirmedEmail?: boolean;

    @IsOptional()
    @IsInt()
    @Min(0)
    tickets?: number;

    @IsOptional()
    @IsBoolean()
    isActive?:boolean
}