import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Promotion } from "./promotion";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({
        nullable: true,
    })
    description: string;

    @Column()
    price: number;

    @Column({
        nullable: true,
    })
    image: string;

    @ManyToMany(() => Promotion, (promotion) => promotion.products)
    @JoinTable()
    promotions: Promotion[]
}