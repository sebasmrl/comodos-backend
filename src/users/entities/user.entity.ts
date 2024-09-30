import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'users'})
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({  type:'int', unique:true})
    dni:number;

    @Column({  type:'text', unique:true})
    email:string;

    @Column({  type:'text'})
    password:string;
    
    @Column({  type:'text'})
    names:string;
    
    @Column({  type:'text'})
    lastNames:string;

    @Column({ type:'bool', default:false})
    confirmedEmail: boolean;

    @Column({ type:'int', default:1})
    tickets: number;

    @Column({ type: 'timestamp', default: new Date()})//.toLocaleDateString('es-CO', { year: "numeric", month:'2-digit', day:'2-digit'}) })
    createdAt: Date;

    @Column({type:'bool', default:true})
    isActive:boolean;

    @Column({type:'text', default: '' })
    profilePhoto: string;

    //------------------Relations------------------
    //!TODO  OneToMany
    //packages: Package[]

    //!TODO OneToMany
    //ads: Ad[]

}
