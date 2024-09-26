import { IsBoolean, IsEmail, IsInt, IsPositive, IsString, Matches, MaxLength, Min, MinLength } from "class-validator";

export class CreateUserDto {

    @IsInt()
    @Min(1000000)
    @IsPositive()
    dni:number; 

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password:string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(25)
    names:string;
    
    @IsString()
    @MinLength(2)
    @MaxLength(25)
    lastNames:string;

    /*  
        -No necesarias, tienen valores por defecto
        confirmedEmail: boolean;
        tickets: number;
        createdAt: Date;
        isActive:boolean
    */
}
