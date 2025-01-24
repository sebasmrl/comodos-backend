import { Ad } from "src/ad/entities/ad.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'propertytypes' })
export class PropertyType {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', unique: true, length: 40 })
    name: string;

    @OneToMany(
        () => Ad,
        (ad) => ad.propertyType,
        { onDelete: "SET NULL" }
    )
    adds: Ad[]
}
