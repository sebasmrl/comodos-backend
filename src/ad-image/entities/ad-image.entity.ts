import { Ad } from "src/ad/entities/ad.entity";
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'ad_images'})
export class AdImage {

        @PrimaryGeneratedColumn('uuid')
        id:string;

        @Column({type:"varchar", length:10})
        fieldName:string;

        @Column({type:'text', nullable:false})
        url:string;
    
        @ManyToOne(
            ()=>Ad,
            (ad)=> ad,
            {eager:false, onDelete: "SET NULL" }
        )
        ad:Ad;

}
