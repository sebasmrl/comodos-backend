import { Currency } from "src/common/constants/currency.constant";
import { StringModifiers } from "src/common/helpers/string-modifiers.helper";
import { Package } from "src/packages/entities/package.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name:'package_types'})
export class PackageType {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({type:'text'})
    name: string; // unico, dual, arrendador, arrendador-multiple
    
    @Column({ type:'text', unique:true})
    sku:string

    @Column({ type:'float', nullable:false})    
    price: number;

    @Column({ type:'text', nullable:false, default: Currency.COP})
    currencyCode: Currency;

    @Column({ type:'int', default:0})
    discount: number;
    
    @Column({ type:'int'})
    tickets: number;

    //Para prevenir si se crea con datos erroneos
    @Column({ type:'bool', default:false})
    isActive: boolean;

    @Column({type:'int', default: new Date().getFullYear()})
    since:number

    @Column({ type: 'timestamp', default: new Date()}) //date  // time
    createdAt: Date;

    @Column({ type: 'timestamp', default: new Date()})
    updatedAt: Date;

    //------------------------ Relations ---------------------------
    //relacion con Packages OneToMany - NO traer sus registros relacionados
    @OneToMany(
        ()=>Package,
        (pack)=> pack.packageType,
        { cascade:true }
    )
    packages: Package[];






    @BeforeInsert()
    beforePackageCreated():void{
        this.name= StringModifiers.toUpperCamelCase(this.name)
        this.sku = `${StringModifiers.toLowerCase(this.name, '_')}_${this.since}`;
    }

    @BeforeUpdate()
    beforePackageUpdated():void {
        this.updatedAt = new Date()
        this.sku = `${StringModifiers.toLowerCase(this.name, '_')}_${this.since}`;
    }

}
