import { PackageType } from "src/package-types/entities/package-type.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'packages'})
export class Package {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({ type: 'timestamp', default: new Date()})
    purchaseDate?: Date;


    //------------------------ relations -------------------------
    @ManyToOne(
        ()=>User,
        (user) => user.packages,
    )
    user: User

    @ManyToOne(
        ()=>PackageType,
        (packageType)=> packageType.packages,
        { eager:true }
    )
    packageType: PackageType;

    //TODO: El usuario debe actualizar el numero de tickets cuando se compra un paquete
    //TODO: (posible) MethodPay - iddelpago

    

}
