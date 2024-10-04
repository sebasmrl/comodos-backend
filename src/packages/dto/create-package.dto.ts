import { Type } from "class-transformer";
import { IsDate, IsString, IsUUID } from "class-validator";
import { PackageType } from "src/package-types/entities/package-type.entity";
import { User } from "src/users/entities/user.entity";

//TODO: Debe manejar en algun momento el pago 
export class CreatePackageDto {

    @IsUUID()
    @Type(()=>User)
    user: User;

    @IsString()
    @IsUUID('all')
    @Type( ()=> PackageType)
    packageType: PackageType;

}
