import { StringModifiers } from "src/common/helpers";
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Coords } from "../dto/coords.dto";


@Entity({ name:'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'integer', unique:true})
    dni:number;

    @Column({type:'text', unique:true})
    email:string;

    @Column({type:'text'})
    password:string;

    @Column({type:'text'})
    names:string;

    @Column({type:'text'})
    lastnames:string;

    @Column({type:'text', enum:['M', 'F'], nullable:true})
    gender:string;

    @Column({type:'date'}) 
    birthdate: Date;

    @Column({type:'text'})
    nationality:string;

    @Column({type:'integer'})
    phone:number;

    @Column({name:'phone_code',type:'integer'})
    phoneCode:number;

    @Column({name:'last_connection',type:'timestamptz', default:  new Date()})
    lastConnection:Date

    @Column({type:'boolean', default:true})
    state:boolean;

    @Column({ type:'jsonb', nullable:true})
    coords:Coords
    

    //TODO: Relations
    //Relations
    //profileImage:Image; //OneToOne
    //ratings: Rating[] //OneToMany
    //adds: Add[] //


    @BeforeInsert()
    beforeUserInsert():void{
       this.names = StringModifiers.toUpperCase(this.names);
       this.lastnames = StringModifiers.toUpperCase(this.lastnames);
       
    }

    @BeforeUpdate()
    beforeUserUpdate():void{
        if(this.names) this.names = StringModifiers.toUpperCase(this.names);
        if(this.lastnames) this.lastnames = StringModifiers.toUpperCase(this.lastnames);
    }


}
