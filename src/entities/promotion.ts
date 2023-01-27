import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Product } from "./product";

@Entity()
export class Promotion {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    discount: number;

    @ManyToMany(() => Product)
    @JoinTable()
    products: Product[]
}