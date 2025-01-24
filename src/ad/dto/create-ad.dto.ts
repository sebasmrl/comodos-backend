import { Type } from "class-transformer";
import { IsBoolean, IsIn, IsInt, IsNumber, IsObject, IsOptional, IsPositive, IsString, IsUUID, MaxLength, MinLength, ValidateNested } from "class-validator";
import { AdPeriod } from "src/ad-period/entities/ad-period.entity";
import { Coords } from "src/common/dto/coords.dto";


export class CreateAdDto {

    @IsString({ message: 'El campo name debe ser una cadena de carateres' })
    @MinLength(2, { message: 'EL campo name debe contener al menos 2 caracteres' })
    @MaxLength(50, { message: 'EL campo name debe ser menor o igual a 50 caracteres' })
    name: string;

    @IsString({ message: 'El campo description debe ser una cadena de carateres' })
    @MinLength(50, { message: 'EL campo description debe contener al menos 50 caracteres' })
    @MaxLength(500, { message: 'EL campo description debe ser menor o igual a 500 caracteres' })
    description: string;

    @IsString({ message: 'El campo locationCountry debe ser una cadena de caracteres' })
    @MaxLength(25, { message: 'El campo locationCountry deber menor o igual a 25 caracteres' })
    locationCountry: string;

    @IsString({ message: 'El campo locationState debe ser una cadena de caracteres' })
    @MaxLength(25, { message: 'El campo locationState deber menor o igual a 25 caracteres' })
    locationState: string;

    @IsString({ message: 'El campo locationCity debe ser una cadena de caracteres' })
    @MaxLength(25, { message: 'El campo locationCity deber menor o igual a 25 caracteres' })
    locationCity: string;

    @IsString({ message: 'El campo address debe ser una cadena de caracteres' })
    @MaxLength(60, { message: 'El campo locationCountry deber menor o igual a 60 caracteres' })
    address: string;

    @IsObject({ message: 'El campo coords debe ser un objeto {lat:number, lng:number}' })
    @ValidateNested()
    @Type(() => Coords)
    coords: Coords
    
    @IsNumber({}, { message: 'El campo price debe ser un numero válido' })
    @IsPositive({ message: 'El campo price debe ser un número positivo' })
    price: number;

    @IsOptional()
    @IsString({ message: 'El campo currency debe ser una cadena de caracteres' })
    @IsIn(['COP', 'USD', 'EUR'], { message: (values) => `El campo currency no coincide con los valores permitidos: [${values.constraints}]` })
    currency?: string;

    @IsInt({ message: 'El campo rooms debe ser un valor entero' })
    @IsPositive({ message: 'El campo rooms debe ser un valor entero positivo' })
    rooms: number;

    @IsBoolean({ message: 'El campo livingRoom debe contener un valor boolean' })
    livingRoom: boolean;

    @IsInt({ message: 'El campo bathrooms debe ser un valor entero' })
    @IsPositive({ message: 'El campo bathrooms debe ser un valor entero positivo' })
    bathrooms: number;

    @IsBoolean({ message: 'El campo isSharedBathroom debe contener un valor boolean' })
    isSharedBathroom: boolean;

    @IsOptional()
    @IsInt({ message: 'El campo floors debe ser un valor entero' })
    @IsPositive({ message: 'El campo floors debe ser un valor entero positivo' })
    floors?: number;

    @IsString({ message: 'El campo stratum debe ser una cadena de caracteres' })
    @MaxLength(30, { message: 'El campo stratumdeber menor o igual a 30 caracteres' })
    stratum: string;

    @IsBoolean({ message: 'El campo yard debe contener un valor boolean' })
    yard: boolean;

    @IsInt({ message: 'El campo squareMeters debe ser un valor entero' })
    @IsPositive({ message: 'El campo squareMeters debe ser un valor entero positivo' })
    squareMeters: number;

    @IsOptional()
    @IsBoolean({ message: 'El campo motoParking debe contener un valor boolean' })
    motoParking?: boolean;

    @IsOptional()
    @IsBoolean({ message: 'El campo carParking debe contener un valor boolean' })
    carParking?: boolean;

    @IsOptional()
    @IsNumber({}, { message: 'El campo administrationCost debe ser un numero válido' })
    @IsPositive({ message: 'El campo administrationCost debe ser un número positivo' })
    administrationCost?: number;

    @IsOptional()
    @IsBoolean({ message: 'El campo isSharedKitchen debe contener un valor boolean' })
    isSharedKitchen?: boolean;

    @IsBoolean({ message: 'El campo furnished debe contener un valor boolean' })
    furnished: boolean;

    @IsBoolean({ message: 'El campo hasElectricLightService debe contener un valor boolean' })
    hasElectricLightService: boolean;

    @IsBoolean({ message: 'El campo hasGasService debe contener un valor boolean' })
    hasGasService: boolean;

    @IsBoolean({ message: 'El campo hasWaterService debe contener un valor boolean' })
    hasWaterService: boolean;

    @IsBoolean({ message: 'El campo hasInternetServiceIntegrated debe contener un valor boolean' })
    hasInternetServiceIntegrated: boolean;

    //user:User viene en la autenticacion

    @IsUUID('all',{message:'El campo period es requerido y debe ser un UUID valido'})
    period:AdPeriod;
    //No se puede crear sin
    //period:PeriodAd
}
