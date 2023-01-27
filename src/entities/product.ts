import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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

    
}