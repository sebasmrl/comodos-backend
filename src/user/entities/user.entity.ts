import { StringModifiers } from "src/common/helpers";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Coords } from "../../common/dto/coords.dto";
import { ProfileImage} from "src/profile-image/entities/profile-image.entity";


@Entity({ name:'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'bigint', unique:true})
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

    @Column({type:'bigint'})
    phone:number;

    @Column({name:'phone_code',type:'bigint'})
    phoneCode:number;

    @Column({name:'last_connection',type:'timestamptz', default:  new Date()})
    lastConnection:Date

    @Column({type:'boolean', default:true})
    state:boolean;

    @Column({ type:'jsonb', nullable:true})
    coords:Coords
    
    
    //---------------- Relations ----------------------
    @JoinColumn({name:'profile_image'})
    @OneToOne(
        ()=>ProfileImage,
        (profileImage)=> profileImage.user,
        {eager:true, cascade:true} 
    )
    profileImage:ProfileImage;
    
    //TODO: Relations
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
