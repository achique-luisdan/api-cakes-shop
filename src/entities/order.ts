import { Entity, PrimaryGeneratedColumn,  CreateDateColumn, OneToMany  } from "typeorm";
import { Item } from "./item";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn ()
    createdDate: Date;

    @OneToMany(() => Item, item => item.order, {eager: true, cascade: true})
    items: Item [];

}
