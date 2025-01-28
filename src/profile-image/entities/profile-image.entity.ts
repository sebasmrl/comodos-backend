import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('profile_images')
export class ProfileImage {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'text', nullable:true})
    key?:string;

    @OneToOne(
        ()=>User,
        (user)=> user.profileImage,
        {eager:false, onDelete: 'SET NULL'}
    )
    user:User
}
