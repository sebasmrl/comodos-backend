import { AdImage } from "src/ad-image/entities/ad-image.entity";
import { AdPeriod } from "src/ad-period/entities/ad-period.entity";
import { Coords } from "src/common/dto/coords.dto";
import { PropertyType } from "src/property-type/entities/property-type.entity";
import { User } from "src/user/entities/user.entity";
import { BeforeUpdate, Column, Entity, JoinColumn, JoinTable, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('ads')
export class Ad {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'varchar', length:50})
    name:string;

    @Column({type:'varchar', length:500})
    description:string;

    @Column({ type:'jsonb'})
    coords:Coords

    @Column({name:'location_country', type:'varchar', length:25})
    locationCountry:string;

    @Column({name:'location_state', type:'varchar', length:25})
    locationState:string;

    @Column({name:'location_city', type:'varchar', length:25})
    locationCity:string;

    @Column({type:'varchar', length:60})
    address:string;

    @Column({ type:'decimal'})
    price:number;

    @Column({ type:'varchar', length:3, default:'COP'})
    currency:string;

    @Column({type:'integer'})
    rooms:number;

    @Column({name:'living_room', type:'boolean', default:false})
    livingRoom:boolean;

    @Column({type:'integer'})
    bathrooms:number;

    @Column({name:'is_shared_bathroom', type:'boolean', default:false})
    isSharedBathroom:boolean;

    @Column({type:'integer', default:1})
    floors:number;

    @Column({ type:'varchar', length:30})
    stratum:string;
    
    @Column({ type:'boolean'})
    yard:boolean;

    @Column({ name:'square_meters', type:'integer'})
    squareMeters:number;

    @Column({name:'moto_parking', type:'boolean', default:false})
    motoParking:boolean;

    @Column({name:'car_parking', type:'boolean', default:false})
    carParking:boolean;

    @Column({name:'administration_cost', type:'decimal', nullable:true})
    adminitrationCost:number;

    @Column({name:'has_kitchen', type:'boolean', default:true})
    hasKitchen:boolean;

    @Column({name:'is_shared_kitchen', type:'boolean', default:false})
    isSharedKitchen:boolean;

    @Column({type:'boolean', default:false})
    furnished:boolean;

    @Column({name:'has_electric_light_service', type:'boolean'})
    hasElectricLightService:boolean;

    @Column({name:'has_gas_service', type:'boolean'})
    hasGasService:boolean;

    @Column({name:'has_water_service', type:'boolean'})
    hasWaterService:boolean;

    @Column({name:'has_internet_service_integrated', type:'boolean'})
    hasInternetServiceIntegrated:boolean;

    @Column({name:'reneval_date',type:'timestamptz', default:  new Date()})
    renevaldDate:Date

    //days*24h*60min*60s*1000ms
    @Column({name:'expired_date',type:'timestamptz', default:  new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)}) 
    expiredDate:Date

    @Column({name:'updated_at',type:'timestamptz', default:  new Date()})
    updateAt:Date

    @Column({name:'created_at',type:'timestamptz', default:  new Date()})
    createdAt:Date
    //31


    // ----------------- Relations ------------------
    @ManyToOne(
        ()=>User,
        (user)=>user.adds,
        { onDelete: "SET NULL" }
    )
    user:User

    @OneToMany(
        ()=>AdImage, 
    (adImage)=>adImage.ad,
    {eager:true, onDelete: "SET NULL" }
    )
    images:AdImage[];
    //@JoinTable()
    
    @JoinColumn({name:'period_id'})
    @ManyToOne(
        ()=>AdPeriod, 
        (adPeriod)=>adPeriod.adds,
        {eager:true, onDelete: "SET NULL" }
    )
    period:AdPeriod

    @JoinColumn({name:'property_type_id'})
    @ManyToOne(
        ()=>PropertyType, 
        (propertyType)=>propertyType.adds,
        {eager:true, onDelete: "SET NULL" }
    )
    propertyType:PropertyType


    @BeforeUpdate()
    private beforeUpdate(){
        this.updateAt = new Date();
    }
    
}
