import { Ad } from "src/ad/entities/ad.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'ad_periods'})
export class AdPeriod {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'varchar', length:20, unique:true})
    name:string;

    @OneToMany(
        ()=>Ad,
        (ad)=> ad.period,
        { onDelete: "SET NULL" }
    )
    adds:Ad[]

}
