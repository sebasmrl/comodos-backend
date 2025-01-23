import { IsString, MaxLength, MinLength } from "class-validator";





export class CreateAdDto {

    @IsString({message:'El campo name debe ser una cadena de carateres'})
    @MinLength(2,{ message:'EL campo name debe contener al menos 2 caracteres'})
    @MaxLength(50, { message:'EL campo name debe ser menor o igual a 50 caracteres'})
    name: string;

    @IsString({message:'El campo description debe ser una cadena de carateres'})
    @MinLength(50,{ message:'EL campo description debe contener al menos 50 caracteres'})
    @MaxLength(500, { message:'EL campo description debe ser menor o igual a 500 caracteres'})
    description: string;

    @IsString({message:''})
    locationCountry: string;

    locationState: string;

    locationCity: string;

    address: string;

    price: number;

    currency: string;

    rooms: number;

    livingRoom: boolean;

    bathrooms: number;

    isSharedBathroom: boolean;

    floors: number;

    stratum: string;

    yard: boolean;

    squareMeters: number;

    motoParking: boolean;

    carParking: boolean;

    adminitrationCost: number;

    isSharedKitchen: boolean;

    furnished: boolean;

    hasElectricLightService: boolean;

    hasGasService: boolean;

    hasWaterService: boolean;

    hasInternetServiceIntegrated: boolean;

    renevaldDate: Date

    //days*24h*60min*60s*1000ms
    expiredDate: Date

    updateAt: Date

    createdAt: Date
}
