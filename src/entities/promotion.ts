import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./product";

@Entity()
export class Promotion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 120, unique: true, })
    name: string;

    @Column({type: 'float'})
    discount: number;

    @ManyToMany(() => Product)
    products: Product[]

    @Column({ default: true })
    isActive: boolean;
}