import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from "typeorm";
import { Promotion } from "./promotion";

@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 120 })
    name: string;

    @Column({
        type: 'text', nullable: true,
    })
    description: string;

    @Column({type: 'float'})
    price: number;

    @Column({
        type: 'varchar', length: 255, nullable: true,
    })
    image: string;

    @ManyToMany(() => Promotion, (promotion) => promotion.products)
    @JoinTable()
    promotions: Promotion[]
}